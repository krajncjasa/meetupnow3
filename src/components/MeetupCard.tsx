type MeetupCardProps = {
  title: string;
};

export default function MeetupCard({ title }: MeetupCardProps) {
  return <h3>{title}</h3>;
}
