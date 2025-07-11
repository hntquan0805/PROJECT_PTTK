"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
  Loader2,
  AlertCircle,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import {
  registrationInfoSchema,
  createRegistrationSchema,
} from "@/features/registration/schemas";
import { PrintDialog } from "@/features/registration/components/PrintDialog";
import type {
  RegistrationInfoForm,
  CreateRegistrationForm,
} from "@/features/registration/schemas";
import { ScheduleService } from "@/lib/services/ScheduleService";
import ScheduleOption from "@/lib/models/ScheduleOption";

interface SelectedSchedule {
  id: string;
  date: string;
  time: string;
  type: "english" | "it";
  level: string;
}

export default function RegistrationPage() {
  const [currentStep, setCurrentStep] = useState<"input" | "create">("input");
  const [savedRegistrationInfo, setSavedRegistrationInfo] =
    useState<RegistrationInfoForm | null>(null);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [createdDate, setCreatedDate] = useState<Date | null>(null);
  const [availableSchedules, setAvailableSchedules] = useState<
    ScheduleOption[]
  >([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      const res = await fetch("/api/schedules");
      const data = await res.json();
      console.log("Fetched schedules:", data);
      setAvailableSchedules(data);
    };

    fetchSchedules();
  }, []);

  // React Hook Form for step 1
  const registrationForm = useForm<RegistrationInfoForm>({
    resolver: zodResolver(registrationInfoSchema),
    defaultValues: {
      customerType: "individual",
      registrantName: "",
      registrantPhone: "",
      registrantEmail: "",
      examineeName: "",
      examineePhone: "",
      examineeEmail: "",
      examineeId: "",
      selectedSchedules: [],
    },
    mode: "onChange",
  });

  // React Hook Form for step 2
  const createForm = useForm<CreateRegistrationForm>({
    resolver: zodResolver(createRegistrationSchema),
    defaultValues: {
      confirmed: false,
      notes: "",
    },
    mode: "onChange",
  });

  // Watch form values
  const watchedCustomerType = registrationForm.watch("customerType");
  const watchedSelectedSchedules = registrationForm.watch("selectedSchedules");

  // Step 1: Save registration info
  const handleSaveRegistrationInfo = async (data: RegistrationInfoForm) => {
    const loadingToastId = toast.loading("Đang ghi nhận thông tin đăng ký...", {
      description: "Vui lòng chờ trong giây lát",
    });

    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.9) {
            reject(new Error("Lỗi kết nối server"));
          } else {
            resolve(true);
          }
        }, 1500);
      });

      console.log("check data", data);

      console.log(savedRegistrationInfo);

      // Check for schedule conflicts
      const conflictingSchedules = data.selectedSchedules.filter((schedule) => {
        const scheduleOption = availableSchedules.find(
          (s) => s.id === schedule.id
        );
        return scheduleOption && scheduleOption.availableSlots === 0;
      });

      if (conflictingSchedules.length > 0) {
        toast.dismiss(loadingToastId);
        toast.error("Có lịch thi đã hết chỗ!", {
          description: "Vui lòng chọn lại lịch thi khác",
        });
        return;
      }

      setSavedRegistrationInfo(data);
      setCurrentStep("create");

      toast.dismiss(loadingToastId);
      toast.success("Đã ghi nhận thông tin đăng ký thành công!", {
        description: `Đã lưu thông tin cho ${data.examineeName} với ${data.selectedSchedules.length} lịch thi`,
        duration: 4000,
      });
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error("Thông tin không hợp lệ! Vui lòng kiểm tra lại.", {
        description:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi lưu thông tin đăng ký",
        duration: 5000,
      });
    }
  };

  // Step 2: Create registration form
  const handleCreateRegistrationForm = async (data: CreateRegistrationForm) => {
    console.log("Creating registration form with data:", data);
    const loadingToastId = toast.loading("Đang tạo phiếu đăng ký...", {
      description: "Đang xử lý và lưu vào hệ thống",
    });

    try {
      // Simulate API call
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(savedRegistrationInfo),
      });

      const result = await res.json();
      console.log("Đăng ký thành công:", result);
      if (!result.success) {
        toast.error("Có lỗi khi lập phiếu đăng ký!");
        return;
      }
      const newRegistrationId = result.phieuDangKyId;
      const newCreatedDate = new Date();

      setRegistrationId(newRegistrationId);
      setCreatedDate(newCreatedDate);

      toast.dismiss(loadingToastId);
      toast.success("Đã lập phiếu đăng ký thành công!", {
        description: `Mã phiếu đăng ký: ${newRegistrationId}`,
        duration: 6000,
      });

      // Show additional info toast
      setTimeout(() => {
        toast.info("Có thể in phiếu ngay bây giờ", {
          description:
            "Phiếu đăng ký cần được chuyển cho nhân viên kế toán để xử lý thanh toán",
          duration: 5000,
        });
      }, 1000);
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error("Lập phiếu thất bại! Vui lòng kiểm tra lại thông tin.", {
        description:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi tạo phiếu đăng ký",
        duration: 5000,
      });
    }
  };

  const handleScheduleSelection = (scheduleId: string, checked: boolean) => {
    const schedule = availableSchedules.find((s) => s.id === scheduleId);
    if (!schedule) return;

    if (checked && schedule.availableSlots === 0) {
      toast.warning("Lịch thi đã hết chỗ!", {
        description: `${getCertificateTypeLabel(schedule.type)} - ${
          schedule.level
        } vào ${schedule.time} ngày ${new Date(
          schedule.date
        ).toLocaleDateString("vi-VN")} đã đầy`,
      });
      return;
    }

    const currentSchedules = registrationForm.getValues("selectedSchedules");

    if (checked) {
      const newSchedule: SelectedSchedule = {
        id: schedule.id,
        date: schedule.date,
        time: schedule.time,
        type: schedule.type,
        level: schedule.level,
      };
      registrationForm.setValue(
        "selectedSchedules",
        [...currentSchedules, newSchedule],
        {
          shouldValidate: true,
        }
      );

      toast.success("Đã thêm lịch thi", {
        description: `${getCertificateTypeLabel(schedule.type)} - ${
          schedule.level
        }`,
        duration: 2000,
      });
    } else {
      registrationForm.setValue(
        "selectedSchedules",
        currentSchedules.filter((s) => s.id !== scheduleId),
        { shouldValidate: true }
      );

      toast.info("Đã bỏ chọn lịch thi", {
        description: `${getCertificateTypeLabel(schedule.type)} - ${
          schedule.level
        }`,
        duration: 2000,
      });
    }
  };

  const getCertificateTypeLabel = (type: string) => {
    return type === "english" ? "Tiếng Anh" : "Tin học";
  };

  const getCertificateTypeColor = (type: string) => {
    return type === "english"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";
  };

  const resetForm = () => {
    setCurrentStep("input");
    setSavedRegistrationInfo(null);
    setRegistrationId(null);
    setCreatedDate(null);
    registrationForm.reset();
    createForm.reset();
    toast.info("Đã làm mới form đăng ký", {
      description: "Tất cả thông tin đã được xóa",
    });
  };

  const getScheduleStatusColor = (
    availableSlots: number,
    maxCapacity: number
  ) => {
    const ratio = availableSlots / maxCapacity;
    if (ratio === 0) return "text-red-600";
    if (ratio < 0.3) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {currentStep === "input"
              ? "Ghi Nhận Thông Tin Đăng Ký"
              : "Lập Phiếu Đăng Ký"}
          </h1>
          <p className="text-gray-600">
            Trung tâm tổ chức thi chứng chỉ anh ngữ và tin học ACCI
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 space-x-4">
          <div
            className={`flex items-center space-x-2 transition-colors duration-300 ${
              currentStep === "input" ? "text-blue-600" : "text-green-600"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentStep === "input"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-green-600 text-white shadow-lg"
              }`}
            >
              {currentStep === "create" ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                "1"
              )}
            </div>
            <span className="font-medium">Ghi nhận thông tin</span>
          </div>
          <div
            className={`w-20 h-2 rounded-full transition-colors duration-500 ${
              currentStep === "create" ? "bg-green-600" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`flex items-center space-x-2 transition-colors duration-300 ${
              currentStep === "create" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentStep === "create"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              2
            </div>
            <span className="font-medium">Lập phiếu đăng ký</span>
          </div>
        </div>

        {currentStep === "input" ? (
          /* STEP 1: INPUT INFORMATION */
          <Form {...registrationForm}>
            <form
              onSubmit={registrationForm.handleSubmit(
                handleSaveRegistrationInfo
              )}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Registrant Info */}
                <Card className="transition-shadow duration-300 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Thông tin người đăng ký
                    </CardTitle>
                    <CardDescription>
                      {watchedCustomerType === "individual"
                        ? "Thông tin cá nhân của người đăng ký"
                        : "Thông tin đại diện đơn vị"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={registrationForm.control}
                      name="customerType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loại khách hàng *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn loại khách hàng" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="individual">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  Khách hàng tự do
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registrationForm.control}
                      name="registrantName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ và tên *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                watchedCustomerType === "individual"
                                  ? "Nhập họ và tên người đăng ký"
                                  : "Nhập tên người đại diện"
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {watchedCustomerType === "organization" &&
                              "Tên người đại diện của đơn vị"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registrationForm.control}
                      name="registrantPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ví dụ: 0901234567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registrationForm.control}
                      name="registrantEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="example@email.com"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Email để nhận thông báo (không bắt buộc)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Examinee Info */}
                <Card className="transition-shadow duration-300 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Thông tin thí sinh
                    </CardTitle>
                    <CardDescription>
                      Thông tin của người sẽ tham gia thi
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={registrationForm.control}
                      name="examineeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ và tên thí sinh *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập họ và tên thí sinh"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Tên phải khớp với giấy tờ tùy thân
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registrationForm.control}
                      name="examineeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CCCD/CMND *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập số CCCD/CMND" {...field} />
                          </FormControl>
                          <FormDescription>
                            Số căn cước công dân hoặc chứng minh nhân dân
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registrationForm.control}
                      name="examineePhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại</FormLabel>
                          <FormControl>
                            <Input placeholder="Ví dụ: 0901234567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registrationForm.control}
                      name="examineeEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="example@email.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Schedule Selection */}
              <Card
                id="schedule-selection"
                className="transition-shadow duration-300 hover:shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Chọn lịch thi và loại chứng chỉ *
                  </CardTitle>
                  <CardDescription>
                    Chọn các lịch thi và loại chứng chỉ mong muốn
                    {watchedSelectedSchedules.length > 0 && (
                      <span className="ml-2 font-medium text-blue-600">
                        (Đã chọn {watchedSelectedSchedules.length} lịch)
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={registrationForm.control}
                    name="selectedSchedules"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {availableSchedules.map((schedule) => {
                            const isSelected = watchedSelectedSchedules?.some(
                              (s) => s.id === schedule.id
                            );
                            const isFull = schedule.availableSlots === 0;

                            return (
                              <FormField
                                key={schedule.id}
                                control={registrationForm.control}
                                name="selectedSchedules"
                                render={() => (
                                  <FormItem
                                    className={`border rounded-lg p-4 transition-all duration-300 ${
                                      isSelected
                                        ? "border-blue-500 bg-blue-50 shadow-md"
                                        : isFull
                                        ? "border-red-200 bg-red-50 opacity-60"
                                        : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                                    }`}
                                  >
                                    <div className="flex items-start space-x-3">
                                      <FormControl>
                                        <Checkbox
                                          checked={isSelected}
                                          disabled={isFull}
                                          onCheckedChange={(checked) =>
                                            handleScheduleSelection(
                                              schedule.id,
                                              checked as boolean
                                            )
                                          }
                                        />
                                      </FormControl>
                                      <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                          <Badge
                                            className={getCertificateTypeColor(
                                              schedule.type
                                            )}
                                          >
                                            {getCertificateTypeLabel(
                                              schedule.type
                                            )}{" "}
                                            - {schedule.level}
                                          </Badge>
                                          <div className="flex items-center gap-2">
                                            {isFull && (
                                              <AlertCircle className="w-4 h-4 text-red-500" />
                                            )}
                                            <span
                                              className={`text-sm font-medium ${getScheduleStatusColor(
                                                schedule.availableSlots,
                                                schedule.maxCapacity
                                              )}`}
                                            >
                                              {isFull
                                                ? "Hết chỗ"
                                                : `Còn ${schedule.availableSlots}/${schedule.maxCapacity} chỗ`}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                          <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(
                                              schedule.date
                                            ).toLocaleDateString("vi-VN")}
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {schedule.time}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            );
                          })}
                        </div>
                        {watchedSelectedSchedules &&
                          watchedSelectedSchedules.length > 0 && (
                            <div className="p-4 mt-4 border border-blue-200 rounded-lg bg-blue-50">
                              <h4 className="mb-2 font-medium text-blue-900">
                                Lịch thi đã chọn:
                              </h4>
                              <div className="space-y-1">
                                {watchedSelectedSchedules.map(
                                  (schedule, index) => (
                                    <div
                                      key={schedule.id}
                                      className="text-sm text-blue-800"
                                    >
                                      {index + 1}.{" "}
                                      {getCertificateTypeLabel(schedule.type)} -{" "}
                                      {schedule.level} |{" "}
                                      {new Date(
                                        schedule.date
                                      ).toLocaleDateString("vi-VN")}{" "}
                                      | {schedule.time}
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Action buttons */}
              <div className="flex justify-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={resetForm}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Làm mới
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={registrationForm.formState.isSubmitting}
                  className="min-w-[180px]"
                >
                  {registrationForm.formState.isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang lưu...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Lưu thông tin
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          /* STEP 2: CREATE REGISTRATION FORM */
          <div id="create-form" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Read-only Information Display */}
              <Card className="transition-shadow duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Thông tin người đăng ký
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Loại khách hàng
                    </label>
                    <Badge variant="outline" className="w-fit">
                      {savedRegistrationInfo?.customerType === "individual"
                        ? "Khách hàng tự do"
                        : "Đơn vị"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Họ và tên</label>
                    <Input
                      value={savedRegistrationInfo?.registrantName || ""}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Số điện thoại</label>
                    <Input
                      value={savedRegistrationInfo?.registrantPhone || ""}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      value={
                        savedRegistrationInfo?.registrantEmail || "Không có"
                      }
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-shadow duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Thông tin thí sinh
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Họ và tên thí sinh
                    </label>
                    <Input
                      value={savedRegistrationInfo?.examineeName || ""}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CCCD/CMND</label>
                    <Input
                      value={savedRegistrationInfo?.examineeId || ""}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Số điện thoại</label>
                    <Input
                      value={savedRegistrationInfo?.examineePhone || "Không có"}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      value={savedRegistrationInfo?.examineeEmail || "Không có"}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Schedule Display */}
            <Card className="transition-shadow duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Lịch thi và chứng chỉ đã chọn
                </CardTitle>
                <CardDescription>
                  Tổng cộng {savedRegistrationInfo?.selectedSchedules.length}{" "}
                  lịch thi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedRegistrationInfo?.selectedSchedules.map(
                    (schedule, index) => (
                      <div
                        key={schedule.id}
                        className="p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-white"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <Badge
                            className={getCertificateTypeColor(schedule.type)}
                          >
                            {getCertificateTypeLabel(schedule.type)} -{" "}
                            {schedule.level}
                          </Badge>
                          <span className="text-sm font-medium text-gray-500">
                            Lịch #{index + 1}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>
                              Ngày thi:{" "}
                              {new Date(schedule.date).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>Giờ thi: {schedule.time}</span>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Confirmation Form */}
            <Form {...createForm}>
              <form
                onSubmit={createForm.handleSubmit(handleCreateRegistrationForm)}
                className="space-y-6"
              >
                <Card className="transition-shadow duration-300 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Xác nhận và ghi chú
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={createForm.control}
                      name="confirmed"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium">
                              Tôi xác nhận rằng tất cả thông tin trên là chính
                              xác và đã được kiểm tra kỹ lưỡng.
                            </FormLabel>
                            <FormDescription>
                              Sau khi tạo phiếu đăng ký, thông tin sẽ không thể
                              chỉnh sửa. Phiếu cần được chuyển cho nhân viên kế
                              toán để xử lý thanh toán.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ghi chú (không bắt buộc)</FormLabel>
                          <FormControl>
                            <textarea
                              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Nhập ghi chú thêm nếu có..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Ghi chú sẽ được lưu cùng phiếu đăng ký
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Action buttons */}
                <div className="flex justify-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentStep("input")}
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Quay lại
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={
                      createForm.formState.isSubmitting ||
                      !createForm.watch("confirmed")
                    }
                    className="min-w-[180px]"
                  >
                    {createForm.formState.isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang tạo...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Tạo phiếu
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </Form>

            {/* Print Section - Show after successful creation */}
            {registrationId && savedRegistrationInfo && createdDate && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Printer className="w-5 h-5" />
                    Phiếu đăng ký đã sẵn sàng
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    Mã phiếu: {registrationId} - Có thể in ngay bây giờ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <PrintDialog
                      registrationInfo={savedRegistrationInfo}
                      registrationId={registrationId}
                      createdDate={createdDate}
                      trigger={
                        <Button
                          size="lg"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Printer className="w-4 h-4 mr-2" />
                          In phiếu đăng ký
                        </Button>
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="p-4 mt-8 text-sm text-center text-gray-500 bg-white border rounded-lg">
          {currentStep === "input" ? (
            <div className="space-y-1">
              <p className="font-medium">📝 Hướng dẫn:</p>
              <p>
                Vui lòng nhập đầy đủ thông tin và chọn lịch thi trước khi lưu.
              </p>
              <p>Các trường có dấu (*) là bắt buộc.</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="font-medium">⏰ Lưu ý quan trọng:</p>
              <p>
                Sau khi tạo phiếu đăng ký thành công, cần chuyển phiếu cho nhân
                viên kế toán để xử lý thanh toán.
              </p>
              <p>Phiếu đăng ký chưa thanh toán sẽ bị hủy sau 3 ngày.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
