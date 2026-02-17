import type { Request, Response } from "express";
import * as addressService from "../services/addressService.js";

export const getUserAddresses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }

    const addresses = await addressService.getUserAddresses(req.user.id);

    res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }

    const addressId = parseInt(req.params.id as string);

    if (isNaN(addressId)) {
      res.status(400).json({
        success: false,
        error: "Invalid address ID",
      });
      return;
    }

    const address = await addressService.getAddressById(req.user.id, addressId);

    if (!address) {
      res.status(404).json({
        success: false,
        error: "Address not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const createAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }

    const {
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      pinCode,
      addressType,
      isDefault,
    } = req.body;

    if (!fullName || !phoneNumber || !addressLine1 || !city || !state || !pinCode) {
      res.status(400).json({
        success: false,
        error: "All required fields must be provided",
      });
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      res.status(400).json({
        success: false,
        error: "Phone number must be 10 digits",
      });
      return;
    }

    if (!/^\d{6}$/.test(pinCode)) {
      res.status(400).json({
        success: false,
        error: "PIN code must be 6 digits",
      });
      return;
    }

    const address = await addressService.createAddress(req.user.id, {
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      pinCode,
      addressType,
      isDefault,
    });

    res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: address,
    });
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const updateAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }

    const addressId = parseInt(req.params.id as string);

    if (isNaN(addressId)) {
      res.status(400).json({
        success: false,
        error: "Invalid address ID",
      });
      return;
    }

    const {
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      pinCode,
      addressType,
      isDefault,
    } = req.body;

    if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
      res.status(400).json({
        success: false,
        error: "Phone number must be 10 digits",
      });
      return;
    }

    if (pinCode && !/^\d{6}$/.test(pinCode)) {
      res.status(400).json({
        success: false,
        error: "PIN code must be 6 digits",
      });
      return;
    }

    const address = await addressService.updateAddress(
      req.user.id,
      addressId,
      {
        fullName,
        phoneNumber,
        addressLine1,
        addressLine2,
        city,
        state,
        pinCode,
        addressType,
        isDefault,
      }
    );

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: address,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const deleteAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }

    const addressId = parseInt(req.params.id as string);

    if (isNaN(addressId)) {
      res.status(400).json({
        success: false,
        error: "Invalid address ID",
      });
      return;
    }

    await addressService.deleteAddress(req.user.id, addressId);

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const setDefaultAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }

    const addressId = parseInt(req.params.id as string);

    if (isNaN(addressId)) {
      res.status(400).json({
        success: false,
        error: "Invalid address ID",
      });
      return;
    }

    const address = await addressService.setDefaultAddress(
      req.user.id,
      addressId
    );

    res.status(200).json({
      success: true,
      message: "Default address updated",
      data: address,
    });
  } catch (error) {
    console.error("Error setting default address:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
