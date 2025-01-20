interface GuidancePageProps {
  params: {
    category: string;
  };
}

export default function GuidancePage({ params }: GuidancePageProps) {
  const { category } = params;
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Guidance: {category}</h1>
      <p>이 페이지는 "{category}" 카테고리</p>
    </div>
  );
}
