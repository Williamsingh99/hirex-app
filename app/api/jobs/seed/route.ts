import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const supabase = await createClient();

    // Simple seeder: Inserts a set of diverse jobs for a user to match against
    const mockJobs = [
      {
        portal: 'linkedin',
        portal_job_id: 'seed-li-1',
        title: 'Senior Frontend Engineer',
        company: 'Vercel',
        location: 'Remote',
        is_remote: true,
        salary_min: 3000000,
        salary_max: 5000000,
        currency: 'INR',
        description: 'We are looking for a Next.js expert to help build the future of the web. Deep knowledge of React Server Components and Tailwind CSS is required.',
        required_skills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
        experience_required: '5+ years',
        employment_type: 'Full-time',
        posted_at: new Date().toISOString(),
        apply_url: 'https://linkedin.com/jobs/view/1',
      },
      {
        portal: 'indeed',
        portal_job_id: 'seed-ind-1',
        title: 'Fullstack Developer',
        company: 'Stripe',
        location: 'Bangalore',
        is_remote: false,
        salary_min: 2000000,
        salary_max: 3500000,
        currency: 'INR',
        description: 'Build scalable payment APIs using Node.js and React. Experience with high-throughput systems and PostgreSQL is essential.',
        required_skills: ['Node.js', 'React', 'PostgreSQL', 'Redis', 'AWS'],
        experience_required: '3+ years',
        employment_type: 'Full-time',
        posted_at: new Date().toISOString(),
        apply_url: 'https://indeed.com/jobs/view/1',
      },
      {
        portal: 'naukri',
        portal_job_id: 'seed-nau-1',
        title: 'UI Engineer',
        company: 'Zomato',
        location: 'Gurgaon',
        is_remote: false,
        salary_min: 1500000,
        salary_max: 2500000,
        currency: 'INR',
        description: 'Creating beautiful, high-performance interfaces for millions of users. Strong focus on CSS, Animation and UX.',
        required_skills: ['CSS', 'Framer Motion', 'React', 'TypeScript'],
        experience_required: '2+ years',
        employment_type: 'Full-time',
        posted_at: new Date().toISOString(),
        apply_url: 'https://naukri.com/jobs/view/1',
      }
    ];

    const { error } = await supabase
      .from('job_listings')
      .upsert(mockJobs);

    if (error) throw error;

    return NextResponse.json({ success: true, seeded: mockJobs.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
