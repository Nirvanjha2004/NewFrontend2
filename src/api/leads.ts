import { api } from "../common/api";
import { checkUnauthorized } from "../common/api";
import { authStore } from "../api/store/authStore"; // Import your auth store

// Adjust these URLs to match your actual backend endpoints
const MAPPING_SUGGESTIONS_URL = '/leads/mapping-suggestions';
const PROCESS_LEADS_URL = '/leads/process-leads';

// Get mapping suggestions from backend
export const getMappingSuggestions = async (file: File) => {
  const formData = new FormData();
  formData.append("csv_file", file);
  
  try {
    // Send auth token but don't use checkUnauthorized
    return await api.post(MAPPING_SUGGESTIONS_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${authStore.getState().accessToken}`
      }
    });
  } catch (error) {
    // Log error but don't logout user
    console.error("Error getting mapping suggestions:", error);
    throw error;
  }
};

// Process leads with final mapping
export const processLeadsWithMapping = async (file: File, mappingInfo: any) => {
  const formData = new FormData();
  formData.append("csv_file", file);
  formData.append("mappings", JSON.stringify(mappingInfo));
  
  try {
    // Send auth token but don't use checkUnauthorized
    return await api.post(PROCESS_LEADS_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${authStore.getState().accessToken}`
      }
    });
  } catch (error) {
    // Log error but don't logout user
    console.error("Error processing leads:", error);
    throw error;
  }
};
