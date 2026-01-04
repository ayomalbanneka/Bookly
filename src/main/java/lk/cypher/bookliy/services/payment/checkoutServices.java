package lk.cypher.bookliy.services.payment;

import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import lk.cypher.bookliy.dto.*;
import lk.cypher.bookliy.entity.Address;
import lk.cypher.bookliy.entity.Cart;
import lk.cypher.bookliy.entity.DeliveryType;
import lk.cypher.bookliy.entity.User;
import lk.cypher.bookliy.services.CommonServices;
import lk.cypher.bookliy.util.AppUtil;
import lk.cypher.bookliy.util.HibernateUtil;
import org.hibernate.Session;

import java.util.ArrayList;
import java.util.List;

public class checkoutServices {
    public String getCheckoutData(HttpServletRequest request) {
        JsonObject responseObject = new JsonObject();
        String message = "";
        boolean status = false;

        User sessionUser = (User) request.getSession().getAttribute("user");
        if (sessionUser == null) {
            message = "User not logged in.";
        } else {
            Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
            Address primaryAddress = hibernateSession.createQuery("FROM Address a WHERE a.user.id =:userId AND a.isPrimary =:primary", Address.class)
                    .setParameter("userId", sessionUser.getId())
                    .setParameter("primary", true)
                    .getSingleResultOrNull();

            if (primaryAddress == null) {
                message = "No primary address found.";
            } else {
                AddressDTO addressDTO = getAddressDTO(primaryAddress);
                List<Cart> cartList = hibernateSession.createQuery("FROM Cart c WHERE c.user.id=:id", Cart.class)
                        .setParameter("id", sessionUser.getId())
                        .getResultList();

                List<CartDTO> cartDTOList = new CommonServices().generateCartDTOs(cartList);

                List<DeliveryTypeDTO> deleiverTypeDTOList = new ArrayList<>();
                List<DeliveryType> deliveryTypeList = hibernateSession.createQuery("FROM DeliveryType d", DeliveryType.class).getResultList();
                for (DeliveryType deliveryType : deliveryTypeList) {
                    DeliveryTypeDTO deliveryTypeDTO = new DeliveryTypeDTO();
                    deliveryTypeDTO.setId(deliveryType.getId());
                    deliveryTypeDTO.setName(deliveryType.getName());
                    deliveryTypeDTO.setPrice(deliveryType.getPrice());
                    deleiverTypeDTOList.add(deliveryTypeDTO);
                }
                status = true;
                responseObject.add("userPrimaryAddress", AppUtil.gson.toJsonTree(addressDTO));
                responseObject.add("cartList", AppUtil.gson.toJsonTree(cartDTOList));
                responseObject.add("deliveryTypeList", AppUtil.gson.toJsonTree(deleiverTypeDTOList));
            }
            hibernateSession.close();
        }

        responseObject.addProperty("status", status);
        responseObject.addProperty("message", message);
        return AppUtil.gson.toJson(responseObject);
    }

    private static AddressDTO getAddressDTO(Address primaryAddress) {
        AddressDTO addressDTO = new AddressDTO();
        addressDTO.setId(primaryAddress.getId());
        addressDTO.setEmail(primaryAddress.getUser().getEmail());
        addressDTO.setFirstName(primaryAddress.getUser().getFirstName());
        addressDTO.setLastName(primaryAddress.getUser().getLastName());
        addressDTO.setLineOne(primaryAddress.getLine1());
        addressDTO.setLineTwo(primaryAddress.getLine2());
        addressDTO.setPostalCode(primaryAddress.getPostalCode());
        addressDTO.setMobile(primaryAddress.getMobile());
        addressDTO.setPrimary(primaryAddress.isPrimary());

        User user = primaryAddress.getUser();
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());

        CityDTO cityDTO = new CityDTO();
        cityDTO.setId(primaryAddress.getCity().getId());

        DistrictDTO districtDTO = new DistrictDTO();
        districtDTO.setId(primaryAddress.getCity().getDistrict().getId());

        addressDTO.setDistrictDTO(districtDTO);
        addressDTO.setCityDTO(cityDTO);
        return addressDTO;
    }
}
