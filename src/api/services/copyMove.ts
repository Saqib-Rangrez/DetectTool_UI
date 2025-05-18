import { API_BASE_URL, getAuthHeaders } from "../client";
import { ENDPOINTS } from "../endpoints";
import { CopyMoveDetectionResponse } from "../../types/apiTypes";

export async function fetchCopyMoveDetection(
  image: File,
  params: {
    detector: string;
    response_threshold: number;
    matching_threshold: number;
    distance_threshold: number;
    cluster_size: number;
    show_keypoints?: boolean;
    hide_lines: boolean;
    use_mask: boolean;
    mask?: File;
  }
): Promise<CopyMoveDetectionResponse> {
  const formData = new FormData();
  formData.append("image", image);
  if (params.use_mask && params.mask) {
    formData.append("mask", params.mask);
  }
  // const token = getAuthToken();
  const url = new URL(`${API_BASE_URL}${ENDPOINTS.DETECT_COPY_MOVE}`);
  url.searchParams.append("detector", params.detector);
  url.searchParams.append("response_threshold", params.response_threshold.toString());
  url.searchParams.append("matching_threshold", params.matching_threshold.toString());
  url.searchParams.append("distance_threshold", params.distance_threshold.toString());
  url.searchParams.append("cluster_size", params.cluster_size.toString());
  if (params.show_keypoints !== undefined) {
    url.searchParams.append("show_keypoints", params.show_keypoints.toString());
  }
  url.searchParams.append("hide_lines", params.hide_lines.toString());
  url.searchParams.append("use_mask", params.use_mask.toString());

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch copy-move detection: ${response.status}`);
    }

    const data = await response.json();
    
    // Convert base64 result_image to data URL (assume PNG based on input example)
    const imageUrl = `data:image/png;base64,${data.result_image}`;

    return {
      total_keypoints: data.total_keypoints,
      filtered_keypoints: data.filtered_keypoints,
      matches: data.matches,
      clusters: data.clusters,
      regions: data.regions,
      processing_time: data.processing_time,
      result_image: imageUrl,
    };
  } catch (error) {
    console.error("Error fetching copy-move detection:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to process copy-move detection");
  }
}