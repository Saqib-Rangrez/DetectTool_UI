export interface AIDetectionResponse {
  filename: string;
  result: "human" | "ai";
  human_probability: number;
  ai_probability: number;
}

export interface MultiAIDetectionResponse {
  images: AIDetectionResponse[];
  total_files: number;
  human_count: number;
  ai_count: number;
  error_images: { filename: string; error: string }[];
}

export interface CompareImagesResponse {
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

export interface ImageStatsResponse {
  imageUrl: string;
  filename: string;
  stats: { blue: number; green: number; red: number };
  mode: string;
  inclusive: boolean;
}

export interface CopyMoveDetectionResponse {
  total_keypoints: number;
  filtered_keypoints: number;
  matches: number;
  clusters: number;
  regions: number;
  processing_time: number;
  result_image: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}