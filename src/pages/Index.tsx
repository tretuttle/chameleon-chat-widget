import ChatWidget from "@/components/ChatWidget";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ChatWidget initialState="hidden" embedMode="responsive" />
    </div>
  );
};

export default Index;
