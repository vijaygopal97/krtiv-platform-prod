import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const MAX_PHOTO = 8 * 1024 * 1024;
const MAX_VIDEO = 50 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const fullName = String(form.get('fullName') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const mobile = String(form.get('mobile') ?? '').trim();
    const contestCategory = String(form.get('contestCategory') ?? '').trim();

    if (!fullName || !email || !contestCategory) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const photo = form.get('photo');
    if (!(photo instanceof File) || photo.size === 0) {
      return NextResponse.json({ error: 'Photo upload is required.' }, { status: 400 });
    }
    if (photo.size > MAX_PHOTO) {
      return NextResponse.json({ error: 'Photo exceeds size limit.' }, { status: 400 });
    }

    const video = form.get('video');
    if (video instanceof File && video.size > 0 && video.size > MAX_VIDEO) {
      return NextResponse.json({ error: 'Video exceeds size limit.' }, { status: 400 });
    }

    const id = randomUUID();
    const dir = path.join(process.cwd(), 'data', 'contest-submissions');
    await mkdir(dir, { recursive: true });

    const meta = {
      id,
      submittedAt: new Date().toISOString(),
      fullName,
      email,
      mobile,
      dateOfBirth: String(form.get('dateOfBirth') ?? ''),
      gender: String(form.get('gender') ?? ''),
      city: String(form.get('city') ?? ''),
      state: String(form.get('state') ?? ''),
      contestCategory,
      caption: String(form.get('caption') ?? ''),
      photoFile: '',
      videoFile: '',
    };

    const photoExt = path.extname(photo.name) || '.jpg';
    const photoName = `${id}-photo${photoExt}`;
    await writeFile(path.join(dir, photoName), Buffer.from(await photo.arrayBuffer()));
    meta.photoFile = photoName;

    if (video instanceof File && video.size > 0) {
      const videoExt = path.extname(video.name) || '.mp4';
      const videoName = `${id}-video${videoExt}`;
      await writeFile(path.join(dir, videoName), Buffer.from(await video.arrayBuffer()));
      meta.videoFile = videoName;
    }

    await writeFile(path.join(dir, `${id}.json`), JSON.stringify(meta, null, 2), 'utf8');

    return NextResponse.json({ ok: true, id });
  } catch (e) {
    console.error('contest-registration', e);
    return NextResponse.json({ error: 'Server error processing registration.' }, { status: 500 });
  }
}
