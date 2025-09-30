export default function Copyright() {
  const currentYear = new Date().getFullYear();

  return (
    <p className="text-center text-sm text-muted-foreground">
      &copy; {currentYear}
    </p>
  );
}
