"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  nome: string;
  telefone: string;
  dataNascimento: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export default function Formulario() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>();

  const [cepPreenchido, setCepPreenchido] = useState(false);
  const [ultimoCepValido, setUltimoCepValido] = useState("");
  const [formularioEnviado, setFormularioEnviado] = useState(false);
  const [dadosFormulario, setDadosFormulario] = useState<FormData | null>(null);

  const cepAtual = watch("cep");

  const onSubmit = async (data: FormData) => {
    console.log("Dados do formulário:", data);
    // Aqui você pode implementar o envio dos dados
    // Simula um delay de envio
    await new Promise(resolve => setTimeout(resolve, 1000));
    setDadosFormulario(data);
    setFormularioEnviado(true);
  };

  const formatarCEP = (valor: string) => {
    // Remove tudo que não é dígito
    const somenteNumeros = valor.replace(/\D/g, "");

    // Aplica a máscara 00000-000
    if (somenteNumeros.length <= 5) {
      return somenteNumeros;
    } else {
      return `${somenteNumeros.slice(0, 5)}-${somenteNumeros.slice(5, 8)}`;
    }
  };

  const formatarTelefone = (valor: string) => {
    // Remove tudo que não é dígito
    const somenteNumeros = valor.replace(/\D/g, "");

    // Aplica a máscara (00) 00000-0000
    if (somenteNumeros.length <= 2) {
      return somenteNumeros;
    } else if (somenteNumeros.length <= 7) {
      return `(${somenteNumeros.slice(0, 2)}) ${somenteNumeros.slice(2)}`;
    } else {
      return `(${somenteNumeros.slice(0, 2)}) ${somenteNumeros.slice(
        2,
        7
      )}-${somenteNumeros.slice(7, 11)}`;
    }
  };

  const buscarCEP = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, "");

    // Se o CEP foi alterado, habilita os campos novamente
    if (cepLimpo !== ultimoCepValido.replace(/\D/g, "")) {
      setCepPreenchido(false);
      setUltimoCepValido("");
    }

    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cepLimpo}/json/`
        );
        const data = await response.json();

        if (!data.erro) {
          setValue("rua", data.logradouro);
          setValue("bairro", data.bairro);
          setValue("cidade", data.localidade);
          setValue("uf", data.uf);
          setCepPreenchido(true);
          setUltimoCepValido(cep);
        } else {
          setCepPreenchido(false);
          setUltimoCepValido("");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        setCepPreenchido(false);
        setUltimoCepValido("");
      }
    }
  };

  // Observa mudanças no CEP para detectar alterações manuais
  useEffect(() => {
    if (
      cepAtual &&
      cepAtual.replace(/\D/g, "") !== ultimoCepValido.replace(/\D/g, "")
    ) {
      setCepPreenchido(false);
    }
  }, [cepAtual, ultimoCepValido]);

  // Tela de sucesso
  if (formularioEnviado && dadosFormulario) {
    const primeiroNome = dadosFormulario.nome.split(' ')[0];
    
    return (
      <div className="bg-amber-500/5 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-background rounded-lg shadow-xl p-6 md:p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Ícone de sucesso">
                <title>Sucesso</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#ef8e2e] mb-4">
              Que bom ter você aqui, {primeiroNome}! 
            </h1>
            <p className="text-lg text-foreground/90 mb-2">
              Bem-vindo à família Lume! 🎉
            </p>
            <p className="text-foreground/70 mb-2">
              Seu cadastro foi realizado com sucesso e já faz parte da nossa comunidade.
            </p>
            <p className="text-sm text-foreground/60">
              Entraremos em contato em breve para conhecê-lo melhor!
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setFormularioEnviado(false);
              setDadosFormulario(null);
            }}
            className="bg-[#ef8e2e] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#d77a26] transition-colors"
          >
            Enviar Outro Formulário
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-500/5 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-background rounded-lg shadow-xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#ef8e2e] mb-2">
            Bem vindo
          </h1>
          <p className="text-foreground/70">
            Preencha seus dados para se conectar conosco
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#ef8e2e] border-b border-[#ef8e2e]/20 pb-2">
              Dados Pessoais
            </h3>

            {/* Nome */}
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Nome Completo *
              </label>
              <input
                id="nome"
                type="text"
                {...register("nome", {
                  required: "Nome é obrigatório",
                  minLength: {
                    value: 2,
                    message: "Nome deve ter pelo menos 2 caracteres",
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef8e2e] focus:border-transparent transition-colors"
                placeholder="Digite seu nome completo"
              />
              {errors.nome && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.nome.message}
                </span>
              )}
            </div>

            {/* Telefone e Data de Nascimento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="telefone"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Telefone *
                </label>
                <input
                  id="telefone"
                  type="tel"
                  {...register("telefone", {
                    required: "Telefone é obrigatório",
                    pattern: {
                      value: /^\(\d{2}\)\s\d{5}-\d{4}$/,
                      message: "Formato: (xx) xxxxx-xxxx",
                    },
                  })}
                  onChange={(e) => {
                    const valorFormatado = formatarTelefone(e.target.value);
                    e.target.value = valorFormatado;
                    setValue("telefone", valorFormatado);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef8e2e] focus:border-transparent transition-colors"
                  placeholder="(83) 99999-9999"
                  maxLength={15}
                />
                {errors.telefone && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.telefone.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="dataNascimento"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Data de Nascimento *
                </label>
                <input
                  id="dataNascimento"
                  type="date"
                  {...register("dataNascimento", {
                    required: "Data de nascimento é obrigatória",
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef8e2e] focus:border-transparent transition-colors"
                />
                {errors.dataNascimento && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.dataNascimento.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#ef8e2e] border-b border-[#ef8e2e]/20 pb-2">
              Endereço
            </h3>

            {/* CEP */}
            <div>
              <label
                htmlFor="cep"
                className="block text-sm font-medium text-foreground mb-2"
              >
                CEP
              </label>
              <input
                id="cep"
                type="text"
                {...register("cep", {
                  pattern: {
                    value: /^\d{5}-\d{3}$/,
                    message: "CEP deve ter o formato 00000-000",
                  },
                })}
                onChange={(e) => {
                  const valorFormatado = formatarCEP(e.target.value);
                  e.target.value = valorFormatado;
                  setValue("cep", valorFormatado);
                  buscarCEP(valorFormatado);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef8e2e] focus:border-transparent transition-colors"
                placeholder="00000-000 (opcional)"
                maxLength={9}
              />
              {errors.cep && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.cep.message}
                </span>
              )}
              {cepPreenchido && (
                <span className="text-green-600 text-sm mt-1 block">
                  ✓ Endereço preenchido automaticamente. Altere o CEP para
                  editar os campos.
                </span>
              )}
            </div>

            {/* Rua e Número */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label
                  htmlFor="rua"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Rua *
                </label>
                <input
                  id="rua"
                  type="text"
                  {...register("rua", { required: "Rua é obrigatória" })}
                  disabled={cepPreenchido}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef8e2e] focus:border-transparent transition-colors ${
                    cepPreenchido ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  placeholder="Nome da rua"
                />
                {errors.rua && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.rua.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="numero"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Número
                </label>
                <input
                  id="numero"
                  type="text"
                  {...register("numero")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef8e2e] focus:border-transparent transition-colors"
                  placeholder="123 (opcional)"
                />
                {errors.numero && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.numero.message}
                  </span>
                )}
              </div>
            </div>

            {/* Complemento */}
            <div>
              <label
                htmlFor="complemento"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Complemento
              </label>
              <input
                id="complemento"
                type="text"
                {...register("complemento")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef8e2e] focus:border-transparent transition-colors"
                placeholder="Apartamento, casa, etc. (opcional)"
              />
            </div>

            {/* Bairro, Cidade e UF */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="bairro"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Bairro *
                </label>
                <input
                  id="bairro"
                  type="text"
                  {...register("bairro", { required: "Bairro é obrigatório" })}
                  disabled={cepPreenchido}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef8e2e] focus:border-transparent transition-colors ${
                    cepPreenchido ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  placeholder="Nome do bairro"
                />
                {errors.bairro && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.bairro.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="cidade"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Cidade *
                </label>
                <input
                  id="cidade"
                  type="text"
                  {...register("cidade", { required: "Cidade é obrigatória" })}
                  disabled={cepPreenchido}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef8e2e] focus:border-transparent transition-colors ${
                    cepPreenchido ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  placeholder="Nome da cidade"
                />
                {errors.cidade && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.cidade.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="uf"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  UF *
                </label>
                <select
                  id="uf"
                  {...register("uf", { required: "UF é obrigatório" })}
                  disabled={cepPreenchido}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef8e2e] focus:border-transparent transition-colors ${
                    cepPreenchido ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="AC">AC</option>
                  <option value="AL">AL</option>
                  <option value="AP">AP</option>
                  <option value="AM">AM</option>
                  <option value="BA">BA</option>
                  <option value="CE">CE</option>
                  <option value="DF">DF</option>
                  <option value="ES">ES</option>
                  <option value="GO">GO</option>
                  <option value="MA">MA</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="MG">MG</option>
                  <option value="PA">PA</option>
                  <option value="PB">PB</option>
                  <option value="PR">PR</option>
                  <option value="PE">PE</option>
                  <option value="PI">PI</option>
                  <option value="RJ">RJ</option>
                  <option value="RN">RN</option>
                  <option value="RS">RS</option>
                  <option value="RO">RO</option>
                  <option value="RR">RR</option>
                  <option value="SC">SC</option>
                  <option value="SP">SP</option>
                  <option value="SE">SE</option>
                  <option value="TO">TO</option>
                </select>
                {errors.uf && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.uf.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full max-w-md bg-[#ef8e2e] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#d77a26] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Enviando..." : "Enviar Cadastro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
