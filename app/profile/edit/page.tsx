"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/input";
import Button from "@/components/button";
import { useEffect, useState } from "react";
import { updateProfile } from "./actions";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

const editSchema = z
  .object({
    username: z.string().min(3, "사용자 이름은 최소 3자 이상이어야 합니다."),
    password: z.string().optional(),
    password_confirm: z.string().optional(),
    phone: z.string().optional(),
    avatar: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password || data.password_confirm) {
        return data.password === data.password_confirm;
      }
      return true;
    },
    {
      message: "비밀번호가 일치하지 않습니다.",
      path: ["password_confirm"],
    }
  );

type EditFormData = z.infer<typeof editSchema>;

export default function EditProfile() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState({
    username: "",
    phone: "",
    avatar: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      username: "",
      phone: "",
      avatar: "",
    },
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/user");
        if (response.ok) {
          const user = await response.json();
          const values = {
            username: user.username || "",
            phone: user.phone || "",
            avatar: user.avatar || "",
          };
          setDefaultValues(values);
          setValue("username", values.username);
          setValue("phone", values.phone);
          setValue("avatar", values.avatar);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, [setValue]);

  const onSubmit = handleSubmit(async (data: EditFormData) => {
    const formData = new FormData();
    formData.append("username", data.username);
    if (data.password) {
      formData.append("password", data.password);
    }
    if (data.phone) {
      formData.append("phone", data.phone);
    }
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }

    const result = await updateProfile(formData);

    if (result) {
      router.push("/profile");
    }
  });

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center mt-12 text-neutral-300">
        <ArrowPathIcon className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-center mt-12 ">
        나의 프로필
      </h1>
      <form action={onSubmit} className="flex flex-col gap-3">
        <label htmlFor="name">이름 </label>
        <Input
          id="name"
          {...register("username")}
          type="text"
          placeholder="이름"
          defaultValue={defaultValues.username}
          errors={[errors.username?.message ?? ""]}
        />

        <label htmlFor="phone">연락처</label>
        <Input
          id="phone"
          {...register("phone")}
          type="text"
          placeholder="연락처"
          defaultValue={defaultValues.phone}
          errors={[errors.phone?.message ?? ""]}
        />

        <label htmlFor="phone">프로필 사진 URL</label>
        <Input
          {...register("avatar")}
          type="text"
          placeholder="프로필 사진 URL"
          defaultValue={defaultValues.avatar}
          errors={[errors.avatar?.message ?? ""]}
        />

        <label className="mt-5" htmlFor="pwd">
          새로운 비밀번호
        </label>
        <Input
          id="pwd"
          {...register("password")}
          type="password"
          placeholder="새 비밀번호"
          errors={[errors.password?.message ?? ""]}
        />

        <Input
          {...register("password_confirm")}
          type="password"
          placeholder="새 비밀번호 확인"
          errors={[errors.password_confirm?.message ?? ""]}
        />
        <div className="mt-1"></div>
        <Button text="변경하기" />
      </form>
    </div>
  );
}
