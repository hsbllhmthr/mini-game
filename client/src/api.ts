const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface RoomDetails {
  room_code: string;
  status: 'waiting' | 'active' | 'completed';
  phase: string;
  player_count: number;
  max_players: number;
}

export interface CreateRoomResponse {
  room_code: string;
  facilitator_token: string;
}

export async function createRoom(): Promise<CreateRoomResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to create room');
  }
  
  return response.json();
}

export async function getRoomDetails(code: string): Promise<RoomDetails> {
  const response = await fetch(`${API_BASE_URL}/api/v1/rooms/${code.toUpperCase()}`);
  
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || errData.message || 'Failed to fetch room details');
  }
  
  return response.json();
}
