/* eslint-disable @typescript-eslint/no-explicit-any */

import { log } from "console";

// API utility functions

// Get authentication token from localStorage
export const getAuthToken = (): string | null => {
  const userStr = localStorage.getItem('access_token');
  if (!userStr) return null;
  
  try {
    // const user = JSON.parse(userStr);
    return userStr;
  } catch (error) {
    console.error('Error parsing user token:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Create headers with authentication token
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Accept': 'application/json',
  };
};

// Function to handle API errors
export const handleApiError = (error: any): string => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return `Server error: ${error.response.status} - ${error.response.statusText}`;
  } else if (error.request) {
    // The request was made but no response was received
    return 'No response received from server. Please check your internet connection.';
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message || 'An unknown error occurred';
  }
};

// Parse metadata response according to the specified logic
export function parseMetadataResponse(response) {
  const importantKeys = [
    "CreateDate",
    "ModifyDate",
    "Software",
    "FileCreateDate",
    "Datecreate",
  ];
  const result = {};
  const oddEntries = {};

  let createDate = "N/A";
  const createDateKey = "CreateDate";
  let modifyDate = "N/A";
  let software = "N/A";
  let fileCreateDate = "N/A";
  let datecreate = "N/A";

  // Handle EXIF response (nested arrays)
  if (typeof response === "object" && !response.html_content) {
    for (const groupName in response) {
      const section = response[groupName];
      if (Array.isArray(section)) {
        section.forEach(([key, value]) => {
          if (key === "CreateDate" && createDate === "N/A") {
            createDate = value;
          } else if (key === "Datecreate" && createDate === "N/A") {
            datecreate = value;
          } else if (key === "FileCreateDate" && createDate === "N/A") {
            fileCreateDate = value;
          } else if (key === "ModifyDate") {
            modifyDate = value;
          } else if (key === "Software") {
            software = value;
          }

          if (key.includes("(odd)")) {
            oddEntries[key] = value;
          }
        });
      }
    }

    // Set createDate based on priority
    if (createDate !== "N/A") {
      result[createDateKey] = createDate;
    } else if (datecreate !== "N/A") {
      result[createDateKey] = datecreate;
    } else if (fileCreateDate !== "N/A") {
      result["FileCreateDate"] = fileCreateDate;
    }

    // Add other fields if they exist
    if (modifyDate !== "N/A") result["ModifyDate"] = modifyDate;
    if (software !== "N/A") result["Software"] = software;
  } else if (response.html_content) {
    // Handle header structure response
    result["html_content"] = response.html_content;
  }

  return { ...result, ...oddEntries };
}

// export const uploadImageAndGetMetadata = async (file) => {
//   const token = localStorage.getItem("access_token");
//   if (!token) {
//     throw new Error("No authentication token found. Please log in.");
//   }

//   const formData = new FormData();
//   formData.append("image", file); // Use 'image' to match FastAPI endpoint

//   try {
//     const [exifResponse, headerResponse] = await Promise.all([
//       fetch("http://127.0.0.1:8000/exif", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       }),
//       fetch("http://127.0.0.1:8000/headerstructure", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       }),
//     ]);

//     if (!exifResponse.ok) {
//       const errorText = await exifResponse.text();
//       throw new Error(`EXIF API error: ${exifResponse.statusText} (${errorText})`);
//     }

//     if (!headerResponse.ok) {
//       const errorText = await headerResponse.text();
//       throw new Error(
//         `Header Structure API error: ${headerResponse.statusText} (${errorText})`
//       );
//     }

//     const exifData = await exifResponse.json();
//     const headerData = await headerResponse.json();

//     console.log(exifData);
//     console.log(headerData);

//     const parsedExifData = parseMetadataResponse(exifData);
//     const parsedHeaderData = parseMetadataResponse(headerData);

//     return {
//       exifData: parsedExifData,
//       headerData: parsedHeaderData,
//     };
//   } catch (error) {
//     console.error("Error fetching metadata:", error);
//     throw error;
//   }
// };


export const detectAISingle = async (file: File): Promise<AIDetectionResponse> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('http://127.0.0.1:8000/detect-ai-single', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized: Please log in again');
    }
    throw new Error('Failed to detect AI content');
  }

  const data = await response.json();
  console.log(data)
  return {
    filename: data.filename,
    result: data.result,
    human_probability: data.human_probability,
    ai_probability: data.ai_probability,
  };
};


export const uploadImageAndGetMetadata = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const [exifResponse, headerResponse] = await Promise.all([
    fetch('http://127.0.0.1:8000/exif', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: formData,
    }),
    fetch('http://127.0.0.1:8000/headerstructure', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: formData,
    }),
  ]);

  if (!exifResponse.ok || !headerResponse.ok) {
    if (exifResponse.status === 401 || headerResponse.status === 401) {
      throw new Error('Unauthorized: Please log in again');
    }
    throw new Error('Failed to fetch metadata');
  }

  const exifData = await exifResponse.json();
  const headerData = await headerResponse.text(); // HTML string

  return { exifData, headerData };
};



interface AIDetectionResponse {
  filename: string;
  result: 'human' | 'ai';
  human_probability: number;
  ai_probability: number;
}

interface MultiAIDetectionResponse {
  images: {
    filename: string;
    result: 'human' | 'ai';
    human_probability: number;
    ai_probability: number;
  }[];
  total_files: number;
  human_count: number;
  ai_count: number;
  error_images: { filename: string; error: string }[];
}



export const detectAIImages = async (files: File[]): Promise<MultiAIDetectionResponse> => {
  const accessToken = localStorage.getItem('access_token');
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await fetch('http://127.0.0.1:8000/detect-ai-images', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to detect AI images');
  }

  return response.json();
};



interface CompareImagesResponse {
  input_files: string[];
  compare_files: string[];
  threshold: number;
  total_matches: number;
  matches: {
    input_file: string;
    compare_file: string;
    matched: boolean;
    distance: number;
    threshold: number;
    result: number;
  }[];
  errors: string[];
}


export const compareImages = async (
  inputFiles: File[],
  compareFiles: File[],
  threshold: number
): Promise<CompareImagesResponse> => {
  const accessToken = getAuthToken();
  const formData = new FormData();
  inputFiles.forEach((file) => {
    formData.append('input_files', file);
  });
  compareFiles.forEach((file) => {
    formData.append('compare_files', file);
  });
  formData.append('threshold', (threshold).toString()); 

  const response = await fetch('http://127.0.0.1:8000/compare-faces', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to compare faces: ${errorText}`);
  }

  return response.json();
};
