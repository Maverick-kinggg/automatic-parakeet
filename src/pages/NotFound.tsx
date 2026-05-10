

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">页面未找到</p>
        <a href="/" className="text-primary hover:underline">
          返回首页
        </a>
      </div>
    </div>
  );
}
