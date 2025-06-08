import { API_BASE_URL, getAuthHeaders } from "../client";
import { ENDPOINTS } from "../endpoints";

export interface ErrorLevelAnalysisResponse {
  imageUrl: string;
  processing_time: number;
  original_quality: number;
  output_scale: number;
  contrast: number;
  linear: boolean;
  grayscale: boolean;
  image_size: [number, number];
}

export async function fetchErrorLevelAnalysis(
  image: File,
  quality: number,
  scale: number,
  contrast: number,
  linear: boolean,
  grayscale: boolean
): Promise<ErrorLevelAnalysisResponse> {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("quality", quality.toString());
  formData.append("scale", scale.toString());
  formData.append("contrast", contrast.toString());
  formData.append("linear", linear.toString());
  formData.append("grayscale", grayscale.toString());

  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ERROR_LEVEL_ANALYSIS}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch error level analysis: ${response.status}`);
    }

    const data = await response.json();

    const imageUrl = `data:image/png;base64,${data.result_image}`;

    return {
      imageUrl,
      processing_time: data.processing_time,
      original_quality: data.original_quality,
      output_scale: data.output_scale,
      contrast: data.contrast,
      linear: data.linear,
      grayscale: data.grayscale,
      image_size: data.image_size,
    };
  } catch (error) {
    console.error("Error fetching error level analysis:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to process error level analysis");
  }
}