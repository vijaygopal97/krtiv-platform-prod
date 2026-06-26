import { redirect } from 'next/navigation';
import { destinationPath } from '@/lib/siteNavigation';
import { resolveDestinationSlug } from '@/lib/destinationRedirects';

type Props = { params: Promise<{ slug: string }> };

/** Legacy URL → /places-to-go/:slug */
export default async function LegacyPlaceRedirect({ params }: Props) {
  const { slug } = await params;
  redirect(destinationPath(resolveDestinationSlug(slug)));
}
