import ChatWidget from "@/components/ChatWidget";

const Index = () => {
  return (
    <div className="h-screen w-screen">
      <ChatWidget initialState="horizontal" embedMode="responsive" />
    </div>
  );
};

export default Index;
