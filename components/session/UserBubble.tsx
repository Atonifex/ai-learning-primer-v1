interface UserBubbleProps {
  content: string;
}

export default function UserBubble({ content }: UserBubbleProps) {
  return (
    <div className="flex justify-end mt-2">
      <div className="max-w-[80%] bg-stone-800 text-stone-50 rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
        <p className="text-[15px] leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
