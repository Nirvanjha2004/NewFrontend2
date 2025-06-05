<<<<<<< HEAD
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
=======

import { CSVData, Lead } from "@/types/leads";

export const uploadCSVFile = async (file: File): Promise<{ data: CSVData }> => {
  // Mock implementation - in real app this would parse the CSV
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
  
  return {
    data: {
      fileName: file.name,
      fileSize: `${Math.round(file.size / 1024)} KB`,
      columns: [
        {
          name: "URL",
          type: "do-not-import",
          samples: [
            "https://www.linkedin.com/in/rachana-peesara-478b74265",
            "https://www.linkedin.com/in/kelseyrandich",
            "https://www.linkedin.com/in/julieBoydstun",
            "https://www.linkedin.com/in/anthony-gallegro-960529156"
          ]
        },
        {
          name: "First Name",
          type: "first-name",
          samples: ["Rachana", "Kelsey", "Julie", "Anthony"]
        },
        {
          name: "Last Name", 
          type: "last-name",
          samples: ["Peesara", "Randich", "Boydstun", "Gallegro"]
        },
        {
          name: "Full Name",
          type: "do-not-import",
          samples: [
            "Rachana Peesara",
            "Kelsey Randich", 
            "Julie Boydstun",
            "Anthony Gallegro"
          ]
        },
        {
          name: "Headline",
          type: "do-not-import", 
          samples: [
            "Sr. Bench Sales Recruiter",
            "Recruiting Operations Leader | Former Calm",
            "Previous Sr. TA Partner @DeltaDental, currently looking for my next big role!",
            "Senior Sales Recruiter at NICE Ltd"
          ]
        },
        {
          name: "Email Address",
          type: "email",
          samples: [
            "nirvanjha2004@outflo.io",
            "nirvanjha2004@outflo.io", 
            "nirvanjha2004@outflo.io",
            "nirvanjha2004@outflo.io"
          ]
        },
        {
          name: "Job Title",
          type: "job-title",
          samples: [
            "Sr. Bench Sales Recruiter",
            "Recruiting Operations Leader",
            "Sr. TA Partner", 
            "Senior Sales Recruiter"
          ]
        },
        {
          name: "Company URL",
          type: "do-not-import",
          samples: ["", "", "", ""]
        },
        {
          name: "Tags",
          type: "do-not-import", 
          samples: ["", "", "", ""]
        },
        {
          name: "First Para",
          type: "do-not-import",
          samples: ["Hi my name is", "", "", ""]
        }
      ],
      rowCount: 150
    }
  };
};

export const processLeads = async (csvData: CSVData, columnMappings: Record<string, string>): Promise<{ data: Lead[] }> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock processed leads
  return {
    data: [
      {
        id: "1",
        firstName: "Rachana",
        lastName: "Peesara", 
        email: "nirvanjha2004@outflo.io",
        jobTitle: "Sr. Bench Sales Recruiter"
      },
      {
        id: "2", 
        firstName: "Kelsey",
        lastName: "Randich",
        email: "nirvanjha2004@outflo.io",
        jobTitle: "Recruiting Operations Leader"
      }
    ]
  };
};
>>>>>>> 8d8e8fcd446a13c1ad5cb5133b16ccdd079fa901
