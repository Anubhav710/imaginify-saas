/* eslint-disable camelcase */
import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";
import clerkClient from "@clerk/clerk-sdk-node";

export async function POST(req: NextRequest) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  try {
    const evt = await verifyWebhook(req);

    // Get the ID and type
    const { id } = evt.data;
    const eventType = evt.type;

    // CREATE
    if (eventType === "user.created") {
      const {
        id,
        email_addresses,
        image_url,
        first_name,
        last_name,
        username,
      } = evt.data;

      const user = {
        clerkId: id,
        email: email_addresses[0].email_address,
        username: email_addresses[0].email_address,
        firstName: first_name,
        lastName: last_name,
        photo: image_url,
      };

      const newUser = await createUser(user);

      // Set public metadata
      if (newUser) {
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            userId: newUser._id,
          },
        });
      }

      return NextResponse.json(
        { message: "OK", user: newUser },
        { status: 201 }
      );
    }

    // UPDATE
    if (eventType === "user.updated") {
      const { id, image_url, first_name, last_name, username } = evt.data;

      const user = {
        firstName: first_name,
        lastName: last_name,
        username: username!,
        photo: image_url,
      };

      const updatedUser = await updateUser(id, user);

      return NextResponse.json(
        { message: "OK", user: updatedUser },
        { status: 200 }
      );
    }

    // DELETE
    if (eventType === "user.deleted") {
      const { id } = evt.data;

      const deletedUser = await deleteUser(id!);

      return NextResponse.json(
        { message: "OK", user: deletedUser },
        { status: 200 }
      );
    }

    console.log(`Webhook with and ID of ${id} and type of ${eventType}`);

    return new Response("Webhook received", { status: 200 });
  } catch (error) {
    console.error("Error verifying webhook:", error);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
