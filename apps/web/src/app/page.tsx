"use client";

import Link from "next/link";
import { ArrowRight, Star, Users, Briefcase, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const dummyTalents = [
  { id: "1", name: "Alex Rivera", role: "Actor", image: "https://i.pravatar.cc/150?u=1", rating: 4.9 },
  { id: "2", name: "Sarah Chen", role: "Model", image: "https://i.pravatar.cc/150?u=2", rating: 4.8 },
  { id: "3", name: "Marcus Thorne", role: "Voice Artist", image: "https://i.pravatar.cc/150?u=3", rating: 4.7 },
  { id: "4", name: "Elena Kovic", role: "Dancer", image: "https://i.pravatar.cc/150?u=4", rating: 5.0 },
];

const dummyAgencies = [
  { id: "1", name: "Elite Casting", talents: 120, logo: "EC" },
  { id: "2", name: "Starlight Talent", talents: 85, logo: "ST" },
  { id: "3", name: "Iconic Models", talents: 200, logo: "IM" },
];

const dummyCastings = [
  { id: "1", title: "Commercial Lead", company: "TechCorp", location: "Global / Remote", budget: "$2,000", category: "Commercial" },
  { id: "2", title: "Indie Film - Protagonist", company: "Dream Studios", location: "Jakarta", budget: "$5,000", category: "Film" },
  { id: "3", title: "Fashion Week Model", company: "Z-Fashion", location: "Surabaya", budget: "$1,500", category: "Fashion" },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-16 py-8 md:py-16">
      {/* Hero Section */}
      <section className="container mx-auto px-4 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <Badge variant="outline" className="rounded-full px-4 py-1 text-sm font-medium">
            Project Casty v1.0 is here
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
            Where Performance Meets <span className="text-primary">Opportunity</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
            The professional network for the entertainment industry. Build your profile, find your next role, or cast the perfect talent for your production.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/login">
              <Button size="lg" className="rounded-none px-8">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/castings">
              <Button variant="outline" size="lg" className="rounded-none px-8">
                Browse Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Talents */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-end justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl text-foreground">Featured Talents</h2>
              <p className="text-muted-foreground">Discover top-rated professionals ready for your next project.</p>
            </div>
            <Link href="/talents" className="group flex items-center text-sm font-medium text-primary hover:underline">
              View All Talents
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dummyTalents.map((talent) => (
              <Card key={talent.id} className="rounded-none border-2 transition-all hover:border-primary/50">
                <CardHeader className="p-0">
                  <img
                    src={talent.image}
                    alt={talent.name}
                    className="aspect-square w-full object-cover"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg text-foreground">{talent.name}</CardTitle>
                  <CardDescription>{talent.role}</CardDescription>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t p-4">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {talent.rating}
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 rounded-none px-2 underline">
                    View Profile
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Agencies */}
      <section className="container mx-auto px-4">
        <div className="mb-10 flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl text-foreground">Top Agencies</h2>
            <p className="text-muted-foreground">Partner with industry-leading talent management agencies.</p>
          </div>
          <Link href="/agencies" className="group flex items-center text-sm font-medium text-primary hover:underline">
            Explore Agencies
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {dummyAgencies.map((agency) => (
            <Card key={agency.id} className="rounded-none border-2 p-6 transition-all hover:bg-muted/30">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center border-2 border-primary bg-primary/10 font-bold text-primary">
                  {agency.logo}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-foreground">{agency.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {agency.talents} Talent Members
                  </div>
                </div>
              </div>
              <Button variant="outline" className="mt-6 w-full rounded-none">
                Visit Agency
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Castings */}
      <section className="bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-end justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl text-foreground">Active Castings</h2>
              <p className="text-muted-foreground">Apply for the latest opportunities from verified casting managers.</p>
            </div>
            <Link href="/castings" className="group flex items-center text-sm font-medium text-primary hover:underline">
              Browse All Castings
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {dummyCastings.map((casting) => (
              <Card key={casting.id} className="rounded-none border-2 transition-all hover:bg-background">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className="rounded-none bg-primary font-medium">{casting.category}</Badge>
                    <span className="text-sm font-bold text-primary">{casting.budget}</span>
                  </div>
                  <CardTitle className="mt-4 text-foreground">{casting.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" /> {casting.company}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center justify-between border-t border-dashed bg-muted/20 p-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {casting.location}
                  </div>
                  <Button size="sm" className="rounded-none">Apply Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4">
        <div className="rounded-none border-4 border-primary p-8 md:p-16 text-center">
          <div className="mx-auto max-w-2xl space-y-6">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">Ready to take the stage?</h2>
            <p className="text-muted-foreground">
              Whether you are looking for your big break or the perfect lead, Casty provides the tools you need to succeed in the modern entertainment industry.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/login">
                <Button size="lg" className="rounded-none px-8">Join Now</Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" size="lg" className="rounded-none px-8 underline">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
