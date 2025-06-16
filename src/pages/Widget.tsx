import ChatWidget from "@/components/ChatWidget";

const Widget = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ChatWidget initialState="hidden" embedMode="responsive" />
    </div>
  );
};

export default Widget;
