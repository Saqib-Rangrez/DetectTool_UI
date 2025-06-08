import { API_BASE_URL, getAuthHeaders } from "../client";
import { ENDPOINTS } from "../endpoints";

export interface EdgeDetectionResponse {
  imageUrl: string;
  processing_time: number;
  image_size: {
    width: number;
    height: number;
  };
  parameters: {
    radius: number;
    contrast: number;
    grayscale: boolean;
  };
}

export async function fetchEdgeDetection(
  image: File,
  radius: number,
  contrast: number,
  grayscale: boolean
): Promise<EdgeDetectionResponse> {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("radius", radius.toString());
  formData.append("contrast", contrast.toString());
  formData.append("grayscale", grayscale.toString());

  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.EDGE_FILTER}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch edge detection: ${response.status}`);
    }

    const data = await response.json();

    const imageUrl = `data:image/jpeg;base64,${data.result_image}`;

    return {
      imageUrl,
      processing_time: data.processing_time,
      image_size: {
        width: data.image_size.width,
        height: data.image_size.height,
      },
      parameters: {
        radius: data.parameters.radius,
        contrast: data.parameters.contrast,
        grayscale: data.parameters.grayscale,
      },
    };
  } catch (error) {
    console.error("Error fetching edge detection:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to process edge detection");
  }
}