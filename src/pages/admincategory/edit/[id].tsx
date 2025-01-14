import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminCategoryEditNavbar } from "@/components/admin-categories/edit/admincategoryEditNavbar";
import { AdminCategoryEditCategory } from "@/components/admin-categories/edit/admincategoryEditCategory";

interface Category {
  id: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export default function AdminCategoryEditIndex() {
  const [category, setCategory] = useState<Category | null>(null);
  console.log("category for check fetch", category);
  const [inputCategory, setInputCategory] = useState<string>("");
  const [showPopUpSubmit, setShowPopUpSubmit] = useState<boolean>(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`/api/admincategorise/selectedit/${id}`);
      const fetchedCategory = response.data.data;
      setCategory(fetchedCategory);
      setInputCategory(fetchedCategory.category);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedCategoryData = { category: inputCategory };
      await axios.put(`/api/admincategorise/edit/${id}`, updatedCategoryData, {
        headers: { "Content-Type": "application/json" },
      });
      setShowPopUpSubmit(true);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleInputCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputCategory(event.target.value);
  };

  if (!category) {
    return (
      <div className="w-screen h-screen flex justify-center items-center text-3xl gap-3">
        <div>Loading</div>
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-row w-full">
      {/* AdminCategoryEditSidebar */}
      <AdminSidebar  />
      <div className="w-full flex flex-col">
        <form onSubmit={handleSubmit}>
          {/* AdminCategoryEditNavbar */}
          <AdminCategoryEditNavbar categoryTitle={category.category}/>
          {/* AdminCategoryEditCategory */}
          <AdminCategoryEditCategory
            inputCategory={inputCategory}
            handleInputCategory={handleInputCategory}
            showPopUpSubmit={showPopUpSubmit}
            setShowPopUpSubmit={setShowPopUpSubmit}
            category={category}
          />
        </form>
      </div>
    </div>
  );
}
