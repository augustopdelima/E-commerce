import { Router, Request, Response } from "express";
import { Address } from "../models/addresses";
import { User } from "../models/user";

const router = Router();

interface AddressParams {
  userId: string;
  addressId?: string;
}

interface AddressBody {
  street: string;
  number: string;
  city: string;
  state: string;
  zipcode: string;
}

router.get(
  "/users/:userId/addresses",
  async (req: Request<AddressParams>, res: Response) => {
    try {
      const { userId } = req.params;

      const user = await User.findByPk(userId, {
        include: [{ model: Address, as: "addresses" }],
      }) as User & { addresses?: Address[] } | null;

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      return res.json(user.addresses);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Erro ao buscar endereços" });
    }
  }
);

router.post(
  "/users/:userId/addresses",
  async (
    req: Request<AddressParams, typeof Object, AddressBody>,
    res: Response
  ) => {
    try {
      const { userId } = req.params;
      const { street, number, city, state, zipcode } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const address = await Address.create({
        street,
        number,
        city,
        state,
        zipcode,
        userId: user.id,
      });

      return res.status(201).json(address);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Erro ao cadastrar endereço" });
    }
  }
);

router.delete(
  "/users/:userId/addresses/:addressId",
  async (req: Request, res: Response) => {
    try {
      const { userId, addressId } = req.params;

      const address = await Address.findOne({
        where: { id: addressId, userId },
      });

      if (!address) {
        return res.status(404).json({ error: "Endereço não encontrado" });
      }

      await address.destroy();
      return res.json({ message: "Endereço removido com sucesso" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Erro ao excluir endereço" });
    }
  }
);

export default router;
