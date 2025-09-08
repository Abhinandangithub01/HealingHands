import CryptoJS from 'crypto-js'
import { midnightNetwork } from './midnightIntegration'

export interface ChatMessage {
  id: string
  content: string
  sender: string
  timestamp: string
  roomId: string
  isEncrypted: boolean
  rlnProof?: string
  nullifier?: string
}

export interface ChatRoom {
  id: string
  name: string
  description: string
  memberCount: number
  isPrivate: boolean
  createdAt: string
}

class SimpleZKChat {
  private messages: Map<string, ChatMessage[]> = new Map()
  private rooms: Map<string, ChatRoom> = new Map()

  constructor() {
    this.loadFromStorage()
    this.initializeDefaultRooms()
  }

  private loadFromStorage(): void {
    try {
      const messagesData = localStorage.getItem('zkChat_messages')
      const roomsData = localStorage.getItem('zkChat_rooms')

      if (messagesData) {
        const messages = JSON.parse(messagesData)
        Object.entries(messages).forEach(([roomId, roomMessages]) => {
          this.messages.set(roomId, roomMessages as ChatMessage[])
        })
      }

      if (roomsData) {
        const rooms = JSON.parse(roomsData)
        rooms.forEach((room: ChatRoom) => {
          this.rooms.set(room.id, room)
        })
      }
    } catch (error) {
      console.error('Failed to load chat data from storage:', error)
    }
  }

  private saveToStorage(): void {
    try {
      const messagesObj: Record<string, ChatMessage[]> = {}
      this.messages.forEach((messages, roomId) => {
        messagesObj[roomId] = messages
      })

      localStorage.setItem('zkChat_messages', JSON.stringify(messagesObj))
      localStorage.setItem('zkChat_rooms', JSON.stringify(Array.from(this.rooms.values())))
    } catch (error) {
      console.error('Failed to save chat data to storage:', error)
    }
  }

  private initializeDefaultRooms(): void {
    if (this.rooms.size === 0) {
      const defaultRooms: ChatRoom[] = [
        {
          id: 'general-support',
          name: 'General Support',
          description: 'Open support for all mental health topics',
          memberCount: 42,
          isPrivate: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'anxiety-support',
          name: 'Anxiety Support',
          description: 'Support group for anxiety-related concerns',
          memberCount: 28,
          isPrivate: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'depression-support',
          name: 'Depression Support',
          description: 'Support group for depression-related concerns',
          memberCount: 35,
          isPrivate: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'crisis-support',
          name: 'Crisis Support',
          description: 'Immediate support for crisis situations',
          memberCount: 15,
          isPrivate: false,
          createdAt: new Date().toISOString()
        }
      ]

      defaultRooms.forEach(room => {
        this.rooms.set(room.id, room)
      })

      this.saveToStorage()
    }
  }

  private generateId(): string {
    return CryptoJS.lib.WordArray.random(16).toString()
  }

  private encryptMessage(content: string, roomId: string): string {
    const key = CryptoJS.SHA256(`room:${roomId}`).toString()
    return CryptoJS.AES.encrypt(content, key).toString()
  }

  private decryptMessage(encryptedContent: string, roomId: string): string {
    try {
      const key = CryptoJS.SHA256(`room:${roomId}`).toString()
      const bytes = CryptoJS.AES.decrypt(encryptedContent, key)
      return bytes.toString(CryptoJS.enc.Utf8)
    } catch (error) {
      return encryptedContent // Return as-is if decryption fails
    }
  }

  async joinRoom(roomId: string, userSecret: string): Promise<{ success: boolean; proof?: string }> {
    try {
      // Generate membership proof using Midnight Network
      const membershipProof = await midnightNetwork.generateMembershipProof(roomId)
      
      console.log('✅ Generated room membership proof via Midnight Network')
      return {
        success: true,
        proof: membershipProof.proof
      }
    } catch (error) {
      // Fallback membership proof
      const membershipProof = CryptoJS.SHA256(`membership:${userSecret}:${roomId}:${Date.now()}`).toString()
      
      console.log('⚠️ Generated room membership proof via fallback')
      return {
        success: true,
        proof: membershipProof
      }
    }
  }

  async sendMessage(
    content: string,
    roomId: string,
    sender: string,
    userSecret: string
  ): Promise<ChatMessage> {
    // Encrypt the message
    const encryptedContent = this.encryptMessage(content, roomId)
    
    // Generate RLN proof using Midnight Network
    let rlnProof: string
    let nullifier: string

    try {
      const proof = await midnightNetwork.generateRLNProof(content, roomId)
      rlnProof = proof.proof
      nullifier = proof.nullifier
      
      console.log('✅ Generated RLN proof via Midnight Network')
    } catch (error) {
      // Fallback RLN proof generation
      rlnProof = CryptoJS.SHA256(`rln:${content}:${roomId}:${userSecret}:${Date.now()}`).toString()
      nullifier = CryptoJS.SHA256(`nullifier:${userSecret}:${roomId}`).toString()
      
      console.log('⚠️ Generated RLN proof via fallback')
    }

    const message: ChatMessage = {
      id: this.generateId(),
      content: encryptedContent,
      sender,
      timestamp: new Date().toISOString(),
      roomId,
      isEncrypted: true,
      rlnProof,
      nullifier
    }

    // Store message
    if (!this.messages.has(roomId)) {
      this.messages.set(roomId, [])
    }
    
    const roomMessages = this.messages.get(roomId)!
    roomMessages.push(message)
    
    // Keep only last 100 messages per room
    if (roomMessages.length > 100) {
      roomMessages.splice(0, roomMessages.length - 100)
    }

    this.saveToStorage()
    return message
  }

  getMessages(roomId: string): ChatMessage[] {
    const messages = this.messages.get(roomId) || []
    
    // Decrypt messages for display
    return messages.map(message => ({
      ...message,
      content: message.isEncrypted ? this.decryptMessage(message.content, roomId) : message.content
    }))
  }

  getRooms(): ChatRoom[] {
    return Array.from(this.rooms.values())
  }

  getRoomInfo(roomId: string): ChatRoom | undefined {
    return this.rooms.get(roomId)
  }

  async verifyRLNProof(message: ChatMessage): Promise<boolean> {
    if (!message.rlnProof) {
      return false
    }

    try {
      // Try to verify using Midnight Network
      const proof = {
        proof: message.rlnProof,
        publicSignals: [message.nullifier || ''],
        nullifier: message.nullifier || '',
        commitment: CryptoJS.SHA256(message.content + message.timestamp).toString()
      }
      
      return await midnightNetwork.verifyProof(proof, 'rln_verification')
    } catch (error) {
      // Fallback verification - check if proof exists
      return message.rlnProof.length > 0
    }
  }

  getMessageCount(roomId: string): number {
    return this.messages.get(roomId)?.length || 0
  }

  clearRoomMessages(roomId: string): void {
    this.messages.set(roomId, [])
    this.saveToStorage()
  }

  clearAllMessages(): void {
    this.messages.clear()
    localStorage.removeItem('zkChat_messages')
  }

  // Get network status for chat functionality
  getNetworkStatus(): { connected: boolean; proofServerAvailable: boolean } {
    const networkStatus = midnightNetwork.getNetworkStatus()
    return {
      connected: networkStatus.connected,
      proofServerAvailable: networkStatus.connected
    }
  }
}

// Export singleton instance
export const zkChat = new SimpleZKChat()
export default zkChat
