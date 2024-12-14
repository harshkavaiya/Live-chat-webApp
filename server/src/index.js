import expres from "express";
const app = expres();

const PORT = 4000;

app.get("/", (req, res) => {
  res.send("hello from server side");
});

app.listen(PORT, () => {
  console.log(`server start on http://localhost:${PORT}`);
});
