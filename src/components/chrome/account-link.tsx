import { UserIcon } from "@phosphor-icons/react/dist/ssr";

/**
 * The account affordance in the desktop bar. Reads the session, so it is
 * rendered inside a Suspense boundary by `SiteHeader`.
 */
export function AccountLink({
  profile,
}: {
  profile: { name: string; email: string } | null;
}) {
  return (
    <>
      <UserIcon size={20} aria-hidden="true" />
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] text-muted">
          {profile ? "Signed in" : "Account"}
        </span>
        <span className="font-semibold text-ink">
          {profile ? profile.name.split(" ")[0] : "Sign In / Register"}
        </span>
      </span>
    </>
  );
}
