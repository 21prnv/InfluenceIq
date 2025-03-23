"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useState } from "react";

interface ProfileOverviewProps {
  data?: any;
}

export function ProfileOverview({ data }: ProfileOverviewProps) {
  // State for tracking image loading status
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Extract profile info and ratings from data, with fallbacks
  const profileInfo = data?.profileInfo || {};
  const ratings = data?.ratings || {};
  console.log("Profile Overview data:", profileInfo.profilePic);

  // Extract username and name
  const username = profileInfo.username || "username";
  const name = profileInfo.name || "Name";
  const profilePic = profileInfo.profilePic || "";

  // Extract profile ratings
  const profileRating = ratings.profile || {};
  const contentRating = ratings.content || {};
  const authenticityRating = ratings.authenticity || {};
  const publicPerceptionRating = ratings.publicPerception || {};

  // Generate avatar fallback from name
  const getInitials = (fullName: string): string => {
    return fullName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Overview</CardTitle>
        <CardDescription>
          Influencer profile information and key metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-24 w-24">
              <Image src={profilePic} alt={name} layout="fill" />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="font-medium">@{username}</h3>
              <p className="text-sm text-muted-foreground">{name}</p>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Profile Rating</h4>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {profileRating.score || "7/10"}
                </Badge>
                <span className="text-sm text-muted-foreground">Overall</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{profileRating.bio || "7/10"}</Badge>
                <span className="text-sm text-muted-foreground">Bio</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {profileRating.imageQuality || "8/10"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Image Quality
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {profileRating.linkCredibility || "6/10"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Link Credibility
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-medium">Content Rating</h4>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {contentRating.score || "7/10"}
                </Badge>
                <span className="text-sm text-muted-foreground">Overall</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {contentRating.consistency || "80%"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Consistency
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {contentRating.categoryAlignment || "75%"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Category Alignment
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-medium">Authenticity & Perception</h4>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {authenticityRating.score || "6/10"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Authenticity
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {authenticityRating.riskPercentage || "15%"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Risk Percentage
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {publicPerceptionRating.score || "6/10"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Public Perception
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
