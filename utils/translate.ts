export default function translateSkinType(type: string): string {
  switch (type) {
    case "oily":
      return "Da dầu";
    case "dry":
      return "Da khô";
    case "combination":
      return "Da hỗn hợp";
    case "sensitive":
      return "Da nhạy cảm";
    case "normal":
      return "Da thường";
    default:
      return type; // fallback nếu không match
  }
}
