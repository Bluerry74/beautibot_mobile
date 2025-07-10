import { analyzeFace } from "@/services/face";
import { useMutation } from "@tanstack/react-query";

export const useAnalyzeFaceMutation = () => {
  return useMutation({
    mutationFn: async (imagePath: string) => {
      return await analyzeFace(imagePath);
    },
  });
};
