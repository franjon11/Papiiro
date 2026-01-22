import { AnalysisType } from "../types";

export const useHandlerAnalysis = () => {
  const getTypeOfAnalysis = (message: any): AnalysisType | null => {
    if (message?.photo) return "photo"
    if (message?.text) return "text"
    return null
  }

  return { getTypeOfAnalysis }
}