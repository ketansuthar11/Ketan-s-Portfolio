import prisma from "../config/prisma.js";
import * as socialLinkRepository from "../repository/social-link.repository.js";

export const getSocialLinks = async (profileId: string) => {
  const profile = await prisma.profile.findUnique({
    where: {
      id: profileId,
    },
  });

  if (!profile) {
    throw new Error("PROFILE_NOT_FOUND");
  }

  return socialLinkRepository.findSocialLinksByProfileId(profileId);
};

export const addSocialLink = async (data: {
  profileId: string;
  platform: string;
  url: string;
  icon?: string;
  isVisible?: boolean;
  order?: number;
}) => {
  const profile = await prisma.profile.findUnique({
    where: {
      id: data.profileId,
    },
  });

  if (!profile) {
    throw new Error("PROFILE_NOT_FOUND");
  }

  return socialLinkRepository.createSocialLink(data);
};

export const updateSocialLink = async (
  id: string,
  data: {
    platform?: string;
    url?: string;
    icon?: string;
    isVisible?: boolean;
    order?: number;
  }
) => {
  const existingLink = await socialLinkRepository.findSocialLinkById(id);

  if (!existingLink) {
    throw new Error("SOCIAL_LINK_NOT_FOUND");
  }

  return socialLinkRepository.updateSocialLink(id, data);
};

export const removeSocialLink = async (id: string) => {
  const existingLink = await socialLinkRepository.findSocialLinkById(id);

  if (!existingLink) {
    throw new Error("SOCIAL_LINK_NOT_FOUND");
  }

  return socialLinkRepository.deleteSocialLink(id);
};