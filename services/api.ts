import axios from 'axios';
import { UserPreferences, APIShortlistResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

/**
 * Fetch AI car recommendations based on questionnaire answers using Axios
 */
export async function getRecommendations(preferences: UserPreferences): Promise<APIShortlistResponse> {
  try {
    const response = await axios.post<APIShortlistResponse>(`${API_BASE_URL}/recommend`, preferences, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (err: unknown) {
    console.error('API Error in getRecommendations:', err);
    
    // Extract custom error message from backend if available
    let errorMessage = 'Unable to connect to the backend server. Please verify the backend is running.';
    
    if (axios.isAxiosError(err)) {
      const responseData = err.response?.data as { error?: string } | undefined;
      if (responseData?.error) {
        errorMessage = responseData.error;
      } else {
        errorMessage = err.message || errorMessage;
      }
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }

    return {
      success: false,
      data: {
        recommendedCars: [],
        selectionReasoning: [],
        rejectedCars: [],
      },
      metadata: {
        candidatesCount: 0,
        filtersRelaxed: false,
        relaxationReason: null,
        databaseMode: 'Disconnected',
        aiMode: 'None',
      },
      error: errorMessage,
    };
  }
}

/**
 * Fetch backend health status using Axios
 */
export async function checkBackendHealth(): Promise<{ success: boolean; databaseMode: string; aiIntegration: Record<string, unknown> }> {
  try {
    const response = await axios.get<{
      system?: {
        databaseMode?: string;
        aiIntegration?: Record<string, unknown>;
      };
    }>(`${API_BASE_URL}/health`, {
      timeout: 3000, // abort request after 3s
    });
    
    const json = response.data;
    return {
      success: true,
      databaseMode: json.system?.databaseMode || 'Unknown',
      aiIntegration: json.system?.aiIntegration || {}
    };
  } catch {
    return {
      success: false,
      databaseMode: 'Disconnected',
      aiIntegration: {}
    };
  }
}
