import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

let browserKey: string | undefined;
export async function mapsConfiguration() {
  if (!browserKey) {
    const { Parameter } = await new SSMClient({}).send(
      new GetParameterCommand({
        Name: "/sync/google/api-key",
        WithDecryption: true,
      }),
    );
    if (!Parameter?.Value) throw new Error("Map configuration unavailable");
    browserKey = Parameter.Value;
  }
  // Maps JavaScript keys are browser credentials; the existing GCP referrer
  // restrictions are the security boundary. Never put this in static output.
  return { key: browserKey };
}
