import { useState } from "react";
import { useForm } from "react-hook-form";

const useMultiStepFormPegawai = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [unlockedTabs, setUnlockedTabs] = useState([0]);
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const nextStep = async () => {
    const form = document.querySelector("form");
    if (form && !form.reportValidity()) return;

    const valid = await trigger(getFieldsForTab(activeTab));
    if (!valid) return;

    const nextTab = activeTab + 1;
    if (!unlockedTabs.includes(nextTab)) {
      setUnlockedTabs([...unlockedTabs, nextTab]);
    }
    setActiveTab(nextTab);
  };

  const getFieldsForTab = (tabId) => {
    switch (tabId) {
      case 0:
        return [];
      case 1:
        return [];
      case 2:
        return [];
      case 3:
        return [];
      default:
        return [];
    }
  };

  const prevStep = () => {
    const prevTab = activeTab - 1;
    if (prevTab >= 0) setActiveTab(prevTab);
  };

  return {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    errors,
    activeTab,
    unlockedTabs,
    setActiveTab,
    nextStep,
    prevStep,
  };
};

export default useMultiStepFormPegawai;
