import Header from "@/components/shared/Header";
import TransformationForm from "@/components/shared/TransformationForm";
import { transformationTypes } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const AddTransformationTypePage = async ({
  params,
}: {
  params: Promise<{ type: string }>;
}) => {
  const { type } = await params;
  const transformation =
    transformationTypes[type as keyof typeof transformationTypes];
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }
  const user = await getUserById(userId);
  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />
      <section className="mt-10">
        <TransformationForm
          action="Add"
          userId={user._id}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  );
};

export default AddTransformationTypePage;
