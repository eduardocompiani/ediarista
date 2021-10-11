import { useMemo, useState } from "react";
import { UserShortInterface } from "data/@types/UserInterface";
import { ValidationService } from "data/services/ValidationService";
import { ApiService } from "data/services/ApiService";

interface ApiDiaristaResponse {
  diaristas: UserShortInterface[];
  quantidade_diaristas: number;
}

export default function useIndex() {
  const [cep, setCep] = useState(""),
    cepValido = useMemo(() => {
      return ValidationService.cep(cep);
    }, [cep]),
    [erro, setErro] = useState(""),
    [buscaFeita, setBuscaFeita] = useState(false),
    [carregando, setCarregando] = useState(false),
    [diaristas, setDiaristas] = useState([] as UserShortInterface[]),
    [diaristasRestantes, setDiaristasRestantes] = useState(0);

  async function buscarProfissionais(cep: string) {
    setBuscaFeita(false);
    setCarregando(true);
    setErro("");

    try {
      const { data } = await ApiService.get<ApiDiaristaResponse>(
        "/api/diaristas-cidade?cep=" + cep.replace(/\D/g, "")
      );
      setBuscaFeita(true);
      setDiaristas(data.diaristas);
      setDiaristasRestantes(data.quantidade_diaristas);
    } catch (error) {
      setErro("CEP não encontrado");
    } finally {
      setCarregando(false);
    }
  }

  return {
    cep,
    setCep,
    buscarProfissionais,
    erro,
    diaristas,
    diaristasRestantes,
    buscaFeita,
    carregando,
    cepValido,
  };
}
