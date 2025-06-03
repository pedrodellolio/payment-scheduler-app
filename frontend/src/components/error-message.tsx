type Props = {
  error: string;
};

export default function ErrorMessage({ error }: Props) {
  return <span className="text-sm text-red-500">{error}</span>;
}
