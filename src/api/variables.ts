import { api } from "../common/api";
import { checkUnauthorized } from "../common/api";
import { authStore } from "./store/authStore";

export interface Variable {
  id: string;
  name: string;
  description: string;
  placeholder: string;
  exampleValue: string;
  type: 'lead' | 'sender' | 'custom';
}

// Fetch available variables for messaging
export const getMessageVariables = async (): Promise<Variable[]> => {
  try {
    const response = await api.get('/campaigns/variables');
    return response.data.variables || [];
  } catch (error) {
    console.error("Error fetching message variables:", error);
    // Return default variables if API fails
    return [
      { id: 'first_name', name: 'First Name', description: 'Contact\'s first name', placeholder: '{first_name}', exampleValue: 'John', type: 'system' },
      { id: 'last_name', name: 'Last Name', description: 'Contact\'s last name', placeholder: '{last_name}', exampleValue: 'Smith', type: 'system' },
      { id: 'company', name: 'Company', description: 'Contact\'s company', placeholder: '{company}', exampleValue: 'Acme Inc', type: 'system' },
      { id: 'job_title', name: 'Job Title', description: 'Contact\'s job title', placeholder: '{job_title}', exampleValue: 'Marketing Director', type: 'system' }
    ];
  }
};

// Get variables specific to a campaign's lead list
export const getCampaignVariables = async (leadListId: string): Promise<Variable[]> => {
  try {
    // Get the current auth token
    const token = authStore.getState().accessToken;
    
    // Make request with explicit auth header
    const response = await api.get(`/leads/campaign-variables/${leadListId}`,{},{
        headers: {
        Authorization: `Bearer ${authStore.getState().accessToken}`
      }
    });
    
    return response.data.data?.variables || [];
  } catch (error) {
    console.error("Error fetching campaign variables:", error);
    // Return fallback variables
    return [
      { id: 'first_name', name: 'First Name', description: 'Contact\'s first name', placeholder: '{first_name}', exampleValue: 'John', type: 'lead' },
      { id: 'last_name', name: 'Last Name', description: 'Contact\'s last name', placeholder: '{last_name}', exampleValue: 'Smith', type: 'lead' },
      { id: 'company', name: 'Company', description: 'Contact\'s company', placeholder: '{company}', exampleValue: 'Acme Inc', type: 'lead' }
    ];
  }
};