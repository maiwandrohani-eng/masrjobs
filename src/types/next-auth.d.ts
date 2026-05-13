import type { UserRole } from "@/generated/prisma/enums";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: UserRole;
      organizationId?: string | null;
      /** Public employer name from `Organization.name` (ORG_USER only). */
      organizationName?: string | null;
    };
  }

  interface User {
    role?: UserRole;
    organizationId?: string | null;
    organizationName?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    organizationId?: string | null;
    organizationName?: string | null;
  }
}
