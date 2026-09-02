import React, { useState } from "react";
import {
  Sparkles,
  PawPrint,
  PackageCheck,
  Info,
  Send,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DonatePageProps {
  isDarkMode: boolean;
}

export const DonatePage: React.FC<DonatePageProps> = ({ isDarkMode }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    donorName: "",
    contactInfo: "",
    foodType: "dry",
    brandName: "",
    quantityKg: "",
    dropoffDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      donorName: "",
      contactInfo: "",
      foodType: "dry",
      brandName: "",
      quantityKg: "",
      dropoffDate: "",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <div
          className={`p-3 rounded-2xl ${
            isDarkMode
              ? "bg-[#382013] text-amber-400"
              : "bg-[#f8efe6] text-[#78350f]"
          }`}
        >
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2
            className={`text-2xl font-black ${
              isDarkMode ? "text-[#fff1e6]" : "text-[#2e170a]"
            }`}
          >
            In-Kind Food Donation - CvSU Imus
          </h2>
          <p
            className={`text-sm font-medium ${
              isDarkMode ? "text-[#a38272]" : "text-[#785948]"
            }`}
          >
            We strictly accept direct cat food donations to replenish our station.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Food Donation Pledge Form */}
        <Card
          className={`rounded-2xl border ${
            isDarkMode
              ? "border-[#382013] bg-[#261309]"
              : "border-[#ebdcd0] bg-white"
          }`}
        >
          <CardHeader>
            <CardTitle className="text-lg font-black flex items-center justify-between">
              <span>Pledge a Food Donation</span>
              <Badge className="bg-amber-600 text-[#fff8f0] font-medium text-xs">
                In-Kind Only
              </Badge>
            </CardTitle>
            <CardDescription
              className={`text-xs ${
                isDarkMode ? "text-[#a38272]" : "text-[#785948]"
              }`}
            >
              Fill out this form before dropping off cat food at the station
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div
                className={`p-6 rounded-xl border text-center space-y-3 ${
                  isDarkMode
                    ? "bg-[#1c0f08] border-[#382013]"
                    : "bg-[#fbf7f2] border-[#ebdcd0]"
                }`}
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3
                  className={`text-base font-medium ${
                    isDarkMode ? "text-[#fff1e6]" : "text-[#2e170a]"
                  }`}
                >
                  Pledge Submitted!
                </h3>
                <p
                  className={`text-xs font-medium leading-relaxed ${
                    isDarkMode ? "text-[#a38272]" : "text-[#785948]"
                  }`}
                >
                  Thank you for supporting our campus strays. Please drop off the
                  food at <strong>CvSU Imus Campus Gate 2</strong> as scheduled.
                </p>
                <Button
                  onClick={handleReset}
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-full mt-2"
                >
                  Submit Another Pledge
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label
                    className={`block font-medium mb-1 ${
                      isDarkMode ? "text-[#c2a293]" : "text-[#6e4e3d]"
                    }`}
                  >
                    Your Name / Student ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Maria Santos or Anonymous"
                    value={formData.donorName}
                    onChange={(e) =>
                      setFormData({ ...formData, donorName: e.target.value })
                    }
                    className={`w-full p-2.5 rounded-xl border outline-none font-medium transition-colors ${
                      isDarkMode
                        ? "bg-[#1c0f08] border-[#382013] text-[#fceee6] focus:border-amber-600"
                        : "bg-[#fbf7f2] border-[#ebdcd0] text-[#3e2314] focus:border-amber-700"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block font-medium mb-1 ${
                      isDarkMode ? "text-[#c2a293]" : "text-[#6e4e3d]"
                    }`}
                  >
                    Contact Info / Email (For Log Verification)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. maria@gmail.com or 09123456789"
                    value={formData.contactInfo}
                    onChange={(e) =>
                      setFormData({ ...formData, contactInfo: e.target.value })
                    }
                    className={`w-full p-2.5 rounded-xl border outline-none font-medium transition-colors ${
                      isDarkMode
                        ? "bg-[#1c0f08] border-[#382013] text-[#fceee6] focus:border-amber-600"
                        : "bg-[#fbf7f2] border-[#ebdcd0] text-[#3e2314] focus:border-amber-700"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      className={`block font-medium mb-1 ${
                        isDarkMode ? "text-[#c2a293]" : "text-[#6e4e3d]"
                      }`}
                    >
                      Food Category
                    </label>
                    <select
                      value={formData.foodType}
                      onChange={(e) =>
                        setFormData({ ...formData, foodType: e.target.value })
                      }
                      className={`w-full p-2.5 rounded-xl border outline-none font-medium transition-colors ${
                        isDarkMode
                          ? "bg-[#1c0f08] border-[#382013] text-[#fceee6] focus:border-amber-600"
                          : "bg-[#fbf7f2] border-[#ebdcd0] text-[#3e2314] focus:border-amber-700"
                      }`}
                    >
                      <option value="dry">Dry Kibble</option>
                      <option value="milk">Milk</option>
                      <option value="water">Mineral Drinking Water</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block font-medium mb-1 ${
                        isDarkMode ? "text-[#c2a293]" : "text-[#6e4e3d]"
                      }`}
                    >
                      Weight / Quantity (kg or cans)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2 kg or 5 cans"
                      value={formData.quantityKg}
                      onChange={(e) =>
                        setFormData({ ...formData, quantityKg: e.target.value })
                      }
                      className={`w-full p-2.5 rounded-xl border outline-none font-medium transition-colors ${
                        isDarkMode
                          ? "bg-[#1c0f08] border-[#382013] text-[#fceee6] focus:border-amber-600"
                          : "bg-[#fbf7f2] border-[#ebdcd0] text-[#3e2314] focus:border-amber-700"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      className={`block font-medium mb-1 ${
                        isDarkMode ? "text-[#c2a293]" : "text-[#6e4e3d]"
                      }`}
                    >
                      Brand Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Whiskas, Aozi, Princess"
                      value={formData.brandName}
                      onChange={(e) =>
                        setFormData({ ...formData, brandName: e.target.value })
                      }
                      className={`w-full p-2.5 rounded-xl border outline-none font-medium transition-colors ${
                        isDarkMode
                          ? "bg-[#1c0f08] border-[#382013] text-[#fceee6] focus:border-amber-600"
                          : "bg-[#fbf7f2] border-[#ebdcd0] text-[#3e2314] focus:border-amber-700"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block font-medium mb-1 ${
                        isDarkMode ? "text-[#c2a293]" : "text-[#6e4e3d]"
                      }`}
                    >
                      Expected Drop-off Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dropoffDate}
                      onChange={(e) =>
                        setFormData({ ...formData, dropoffDate: e.target.value })
                      }
                      className={`w-full p-2.5 rounded-xl border outline-none font-medium transition-colors ${
                        isDarkMode
                          ? "bg-[#1c0f08] border-[#382013] text-[#fceee6] focus:border-amber-600"
                          : "bg-[#fbf7f2] border-[#ebdcd0] text-[#3e2314] focus:border-amber-700"
                      }`}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className={`w-full h-10 font-medium rounded-xl flex items-center justify-center gap-2 ${
                    isDarkMode
                      ? "bg-[#d97706] hover:bg-[#b45309] text-[#fff8f0]"
                      : "bg-[#381c0d] hover:bg-[#251208] text-[#fff8f0]"
                  }`}
                >
                  <Send className="w-4 h-4" />
                  Submit Food Donation Pledge
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Physical Drop-Off Guidelines & Info */}
        <Card
          className={`rounded-2xl border ${
            isDarkMode
              ? "border-[#382013] bg-[#261309]"
              : "border-[#ebdcd0] bg-white"
          }`}
        >
          <CardHeader>
            <CardTitle className="text-lg font-black flex items-center justify-between">
              <span>Drop-Off Guidelines</span>
              <Badge className="bg-amber-600 text-[#fff8f0] font-medium text-xs">
                On Campus
              </Badge>
            </CardTitle>
            <CardDescription
              className={`text-xs ${
                isDarkMode ? "text-[#a38272]" : "text-[#785948]"
              }`}
            >
              How to deliver your pledged cat food safely
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`p-4 rounded-xl border space-y-3 ${
                isDarkMode
                  ? "bg-[#1c0f08] border-[#382013]"
                  : "bg-[#fbf7f2] border-[#ebdcd0]"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <PawPrint className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4
                    className={`text-xs font-medium ${
                      isDarkMode ? "text-[#fff1e6]" : "text-[#2e170a]"
                    }`}
                  >
                    Primary Drop Point: Station 01
                  </h4>
                  <p
                    className={`text-xs font-medium ${
                      isDarkMode ? "text-[#a38272]" : "text-[#785948]"
                    }`}
                  >
                    CvSU Imus Campus Gate 2 (Beside Caretaker Shelter)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <PackageCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4
                    className={`text-xs font-medium ${
                      isDarkMode ? "text-[#fff1e6]" : "text-[#2e170a]"
                    }`}
                  >
                    Accepted Items Only
                  </h4>
                  <p
                    className={`text-xs font-medium ${
                      isDarkMode ? "text-[#a38272]" : "text-[#785948]"
                    }`}
                  >
                    Unopened Dry Cat Kibble or Clean
                    Drinking Water Refills.
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border flex items-center gap-3 ${
                isDarkMode
                  ? "bg-[#331a0b] border-[#5e3215] text-amber-400"
                  : "bg-[#fffbeb] border-[#fde68a] text-amber-900"
              }`}
            >
              <Info className="w-5 h-5 shrink-0 text-amber-600" />
              <p className="text-xs font-semibold leading-relaxed">
                Once dropped off, student volunteers will verify your food pledge and log the weight into our public restock heatmap calendar!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};