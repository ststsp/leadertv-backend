export default function handler(req, res) {
  res.status(200).json([
    { id: 1, title: "Първа новина", content: "Това е тестова новина от LeaderTV." },
    { id: 2, title: "Втора новина", content: "Backend API работи успешно на Vercel." }
  ]);
}
