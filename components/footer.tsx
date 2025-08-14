export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">P</span>
            </div>
            <span className="text-xl font-bold text-foreground">PMS Dev Blog</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            프론트엔드 개발자가 되기 위해 내가 학습한 기술과 경험을 기록하는 장소
          </p>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <div className="flex flex-col items-center md:flex-row md:justify-between">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PMS Dev Blog. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
