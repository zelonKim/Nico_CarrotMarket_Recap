"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/input";
import Button from "@/components/button";
import { useEffect, useState } from "react";
import { checkPhoneNumber, updateProfile } from "./actions";
import {
  ArrowPathIcon,
  DevicePhoneMobileIcon,
  LockClosedIcon,
  PencilSquareIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_ERROR,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const editSchema = z
  .object({
    username: z.string().min(2, "사용자 이름은 최소 2자 이상이어야 합니다."),
    password: z
      .string()
      .optional()
      .refine(
        (value) =>
          !value || value.length === 0 || value.length >= PASSWORD_MIN_LENGTH,
        PASSWORD_MIN_LENGTH_ERROR
      )
      .refine(
        (value) => !value || value.length === 0 || PASSWORD_REGEX.test(value),
        PASSWORD_REGEX_ERROR
      ),
    password_confirm: z.string().optional(),
    phone: z
      .string()
      .optional()
      .refine(checkPhoneNumber, "이미 사용중인 핸드폰 번호입니다."),
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

  const onSubmit = async (prevState: unknown, formData: FormData) => {
    // react-hook-form의 validation을 위해 먼저 폼 데이터를 검증
    const data = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      password_confirm: formData.get("password_confirm") as string,
      phone: formData.get("phone") as string,
      avatar: formData.get("avatar") as string,
    };

    // zod 스키마로 검증
    const result = await editSchema.safeParseAsync(data);

    if (!result.success) {
      return result.error.flatten();
    }

    const success = await updateProfile(formData);

    if (success) {
      router.push("/profile");
    }
  };

  const [state, action] = useFormState(onSubmit, null);

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center mt-16 text-orange-500">
        <ArrowPathIcon className="size-6  animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 *:text-neutral-800 max-w-screen-md mx-auto">
      <Link href="/profile">
        <ArrowLeftIcon className="size-8   text-neutral-600 hover:text-neutral-700  hover:scale-110 " />
      </Link>

      <h1 className="text-2xl font-semibold mb-6 text-center mt-8  ">
        마이 프로필 🥕
      </h1>
      <form action={action} className="flex flex-col gap-3">
        <label htmlFor="name" className="flex gap-2 ">
          <PencilSquareIcon className="size-6" />
          이름
        </label>
        <Input
          id="name"
          name="username"
          type="text"
          placeholder="홍길동"
          defaultValue={defaultValues.username}
          errors={state?.fieldErrors.username}
        />

        <label htmlFor="phone" className="flex gap-2">
          <DevicePhoneMobileIcon className="size-6" />
          핸드폰번호
        </label>
        <Input
          id="phone"
          name="phone"
          type="text"
          placeholder="(-하이픈 없이)"
          defaultValue={defaultValues.phone}
          errors={state?.fieldErrors.phone}
        />

        <label htmlFor="phone" className="flex gap-2">
          <UserCircleIcon className="size-6" />
          프로필 사진 URL
        </label>
        <Input
          name="avatar"
          type="text"
          placeholder="https://"
          defaultValue={defaultValues.avatar}
          errors={state?.fieldErrors.avatar}
        />

        <label className="mt-8 flex gap-2" htmlFor="pwd">
          <LockClosedIcon className="size-6" />
          새로운 비밀번호
        </label>
        <Input
          id="pwd"
          name="password"
          type="password"
          placeholder="새 비밀번호"
          errors={state?.fieldErrors.password}
        />

        <Input
          name="password_confirm"
          type="password"
          placeholder="새 비밀번호 확인"
          errors={state?.fieldErrors.password_confirm}
        />
        <div className="mt-1"></div>
        <Button text="변경하기" />
      </form>
    </div>
  );
}
