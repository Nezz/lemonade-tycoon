import StripedBackground from "@/components/StripedBackground";

interface SimulationBackgroundProps {
  children: React.ReactNode;
}

export default function SimulationBackground({
  children,
}: SimulationBackgroundProps) {
  return <StripedBackground>{children}</StripedBackground>;
}
