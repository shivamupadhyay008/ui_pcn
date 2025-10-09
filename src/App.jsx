import NewsView from "./components/NewsView";

function App() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        ARK Connect News
      </h1>

      <NewsView />
    </div>
  );
}

export default App;
