/* eslint-disable @typescript-eslint/no-explicit-any */
// ==========================
// Imports
// ==========================
// import { API_BASE_URL } from "../../apiConfig";
import { ENDPOINTS } from "./endpoints";
const API_BASE_URL = import.meta.env.API_BASE_URL || "http://127.0.0.1:8000";

// ==========================
// Type Definitions
// ==========================
interface AIDetectionResponse {
  filename: string;
  result: "human" | "ai";
  human_probability: number;
  ai_probability: number;
}

interface MultiAIDetectionResponse {
  images: {
    filename: string;
    result: "human" | "ai";
    human_probability: number;
    ai_probability: number;
  }[];
  total_files: number;
  human_count: number;
  ai_count: number;
  error_images: { filename: string; error: string }[];
}

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

// ==========================
// Auth Utilities
// ==========================
export const getAuthToken = (): string | null => {
  const userStr = localStorage.getItem("access_token");
  return userStr || null;
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// ==========================
// Header Helpers
// ==========================
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    Authorization: token ? `Bearer ${token}` : "",
    Accept: "application/json",
  };
};

// ==========================
// Error Handling Utility
// ==========================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleApiError = (error: any): string => {
  if (error.response) {
    return `Server error: ${error.response.status} - ${error.response.statusText}`;
  } else if (error.request) {
    return "No response received from server. Please check your internet connection.";
  } else {
    return error.message || "An unknown error occurred";
  }
};

// ==========================
// Response Parsing
// ==========================
export function parseMetadataResponse(response: any) {
  const result: any = {};
  const oddEntries: any = {};

  let createDate = "N/A";
  let modifyDate = "N/A";
  let software = "N/A";
  let fileCreateDate = "N/A";
  let datecreate = "N/A";

  const createDateKey = "CreateDate";

  if (typeof response === "object" && !response.html_content) {
    for (const groupName in response) {
      const section = response[groupName];
      if (Array.isArray(section)) {
        section.forEach(([key, value]) => {
          if (key === "CreateDate" && createDate === "N/A") createDate = value;
          else if (key === "Datecreate" && createDate === "N/A") datecreate = value;
          else if (key === "FileCreateDate" && createDate === "N/A") fileCreateDate = value;
          else if (key === "ModifyDate") modifyDate = value;
          else if (key === "Software") software = value;

          if (key.includes("(odd)")) {
            oddEntries[key] = value;
          }
        });
      }
    }

    if (createDate !== "N/A") result[createDateKey] = createDate;
    else if (datecreate !== "N/A") result[createDateKey] = datecreate;
    else if (fileCreateDate !== "N/A") result["FileCreateDate"] = fileCreateDate;

    if (modifyDate !== "N/A") result["ModifyDate"] = modifyDate;
    if (software !== "N/A") result["Software"] = software;
  } else if (response.html_content) {
    result["html_content"] = response.html_content;
  }

  return { ...result, ...oddEntries };
}

// ==========================
// API: Upload & Metadata
// ==========================
export const uploadImageAndGetMetadata = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const [exifResponse, headerResponse] = await Promise.all([
    fetch(`${API_BASE_URL}${ENDPOINTS.EXIF}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    }),
    fetch(`${API_BASE_URL}${ENDPOINTS.HEADER_STRUCTURE}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    }),
  ]);

  if (!exifResponse.ok || !headerResponse.ok) {
    if (exifResponse.status === 401 || headerResponse.status === 401) {
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error("Failed to fetch metadata");
  }

  const exifData = await exifResponse.json();
  const headerData = await headerResponse.text();

  return { exifData, headerData };
};

// ==========================
// API: AI Detection - Single
// ==========================
export const detectAISingle = async (file: File): Promise<AIDetectionResponse> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.DETECT_AI_SINGLE}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error("Failed to detect AI content");
  }

  return response.json();
};

// ==========================
// API: AI Detection - Multiple
// ==========================
export const detectAIImages = async (files: File[]): Promise<MultiAIDetectionResponse> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.DETECT_AI_IMAGES}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to detect AI images");
  }

  return response.json();
};

// ==========================
// API: Face Comparison
// ==========================
export const compareImages = async (
  inputFiles: File[],
  compareFiles: File[],
  threshold: number
): Promise<CompareImagesResponse> => {
  const formData = new FormData();
  inputFiles.forEach((file) => formData.append("input_files", file));
  compareFiles.forEach((file) => formData.append("compare_files", file));
  formData.append("threshold", threshold.toString());

  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.COMPARE_FACES}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to compare faces: ${errorText}`);
  }

  return response.json();
};