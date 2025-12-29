"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  nome: string;
  telefone: string;
  tamanho: string;
  estampa: string;
}

interface Tamanho {
  id: number;
  nome: string;
}

interface Estampa {
  id: number;
  nome: string;
  descricao: string;
  imagem: string;
}

const tamanhos: Tamanho[] = [
  { id: 17, nome: "P" },
  { id: 18, nome: "M" },
  { id: 19, nome: "G" },
  { id: 20, nome: "GG" },
];

const estampas: Estampa[] = [
  {
    id: 21,
    nome: "Ano de Frutificar",
    descricao: "Lume 2026",
    imagem: "/images/camisas/camisa frutificar.webp",
  },
  {
    id: 22,
    nome: "O fruto confirma a fé",
    descricao: "Lume 2026",
    imagem: "/images/camisas/camisa confirma fe.webp",
  },
  {
    id: 23,
    nome: "Uma vida que frutifica",
    descricao: "Lume 2026",
    imagem: "/images/camisas/camisa vida.webp",
  },
];

export default function CompraCamisa() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>();

  const [formularioEnviado, setFormularioEnviado] = useState(false);
  const [dadosFormulario, setDadosFormulario] = useState<FormData | null>(null);
  const [imagemModalAberto, setImagemModalAberto] = useState(false);
  const [imagemModalSrc, setImagemModalSrc] = useState("");
  const [imagemModalAlt, setImagemModalAlt] = useState("");

  const estampaSelecionada = watch("estampa");
  const tamanhoSelecionado = watch("tamanho");

  console.log("imagemModalAberto:", imagemModalAberto);
  const onSubmit = async (data: FormData) => {
    console.log("Dados do formulário:", data);

    try {
      // Prepara os dados para envio conforme o formato da API
      const dadosApi = {
        nome: data.nome,
        telefone: data.telefone,
        tamanho: parseInt(data.tamanho) || 0,
        estampa: parseInt(data.estampa) || 0,
      };

      // Envia os dados para a API
      const response = await fetch(
        "https://base.rubensgouveia.com.br/api/database/rows/table/19/?user_field_names=true",
        {
          method: "POST",
          headers: {
            Authorization: "Token J7zCGAUJE6GFjwb8deqEyGhl3hqGBD4t",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosApi),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const resultado = await response.json();
      console.log("Pedido cadastrado com sucesso:", resultado);

      setDadosFormulario(data);
      setFormularioEnviado(true);
    } catch (error) {
      console.error("Erro ao cadastrar pedido:", error);
      alert("Erro ao enviar pedido. Por favor, tente novamente.");
    }
  };

  const abrirModalImagem = (src: string, alt: string) => {
    setImagemModalSrc(src);
    setImagemModalAlt(alt);
    setImagemModalAberto(true);
  };

  const fecharModalImagem = () => {
    setImagemModalAberto(false);
    setImagemModalSrc("");
    setImagemModalAlt("");
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

  // Tela de sucesso
  if (formularioEnviado && dadosFormulario) {
    const primeiroNome = dadosFormulario.nome.split(" ")[0];
    const tamanhoSelecionado = tamanhos.find(
      (t) => t.id === parseInt(dadosFormulario.tamanho)
    );
    const estampaSelecionada = estampas.find(
      (e) => e.id === parseInt(dadosFormulario.estampa)
    );

    return (
      <div className="bg-amber-500/5 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-background rounded-lg shadow-xl p-6 md:p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-label="Ícone de sucesso"
              >
                <title>Sucesso</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#ef8e2e] mb-4">
              Obrigado, {primeiroNome}!
            </h1>
            <p className="text-lg text-foreground/90 mb-4">
              Seu pedido foi realizado com sucesso! 👕
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-800 mb-2">
                📋 Resumo do Pedido:
              </h3>

              {/* Imagem da estampa selecionada */}
              {estampaSelecionada && (
                <div className="mb-4">
                  <div className="relative w-full h-32">
                    <Image
                      src={estampaSelecionada.imagem}
                      alt={estampaSelecionada.nome}
                      fill
                      className="object-cover rounded-lg border-2 border-[#ef8e2e]/20"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <strong>Tamanho:</strong> {tamanhoSelecionado?.nome}
                </p>
                <p>
                  <strong>Estampa:</strong> {estampaSelecionada?.nome}
                </p>
                <p>
                  <strong>Valor:</strong> R$ 60,00
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-foreground/70 mb-4">
                Clique no botão abaixo para realizar o pagamento:
              </p>
              <a
                href="https://mpago.la/1nv11MQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                💳 Pagar R$ 60,00
              </a>
              <p className="text-xs text-foreground/60 mt-2">
                Você será redirecionado para o Mercado Pago
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-blue-800 text-sm">
                  ℹ️ Após o pagamento, entraremos em contato para confirmar a
                  entrega.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-500/5 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-background rounded-lg shadow-xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#ef8e2e] mb-2">
            Camisas Lume 2026
          </h1>
          <p className="text-foreground/70 mb-4">
            Adquira sua camisa do Ano de Frutificar
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#ef8e2e] border-b border-[#ef8e2e]/20 pb-2">
              Dados do Pedido
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

            {/* Telefone */}
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

            {/* Tamanho */}
            <div>
              <label
                htmlFor="tamanho"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Tamanho *
              </label>
              <select
                id="tamanho"
                {...register("tamanho", {
                  required: "Tamanho é obrigatório",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef8e2e] focus:border-transparent transition-colors"
              >
                <option value="">Selecione o tamanho</option>
                {tamanhos.map((tamanho) => (
                  <option key={tamanho.id} value={tamanho.id}>
                    {tamanho.nome}
                  </option>
                ))}
              </select>
              {errors.tamanho && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.tamanho.message}
                </span>
              )}
            </div>
          </div>

          {/* Seleção de Estampa */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#ef8e2e] border-b border-[#ef8e2e]/20 pb-2">
              Escolha sua Estampa *
            </h3>

            {errors.estampa && (
              <span className="text-red-500 text-sm block">
                {errors.estampa.message}
              </span>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {estampas.map((estampa) => (
                <div key={estampa.id}>
                  <input
                    type="radio"
                    id={`estampa-${estampa.id}`}
                    value={estampa.id}
                    {...register("estampa", {
                      required: "Selecione uma estampa",
                    })}
                    className="sr-only"
                  />
                  <label
                    htmlFor={`estampa-${estampa.id}`}
                    className={`block cursor-pointer border-2 rounded-lg p-4 transition-all ${
                      estampaSelecionada === estampa.id.toString()
                        ? "border-[#ef8e2e] bg-[#ef8e2e]/5"
                        : "border-gray-300 hover:border-[#ef8e2e]/50"
                    }`}
                  >
                    {/* Imagem da estampa */}
                    <div className="relative w-full h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden border group">
                      <Image
                        src={estampa.imagem}
                        alt={estampa.nome}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      {/* Botão para ampliar imagem */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          abrirModalImagem(estampa.imagem, estampa.nome);
                        }}
                        className="absolute top-2 right-2 w-6 h-6 bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90"
                        title="Ver imagem ampliada"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <title>Ver imagem ampliada</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                          />
                        </svg>
                      </button>
                    </div>
                    <h4 className="font-medium text-foreground mb-1">
                      {estampa.nome}
                    </h4>
                    <p className="text-sm text-foreground/70">
                      {estampa.descricao}
                    </p>
                    {estampaSelecionada === estampa.id.toString() && (
                      <div className="mt-2 flex items-center text-[#ef8e2e] text-sm">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <title>Estampa selecionada</title>
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Selecionada
                      </div>
                    )}
                  </label>
                </div>
              ))}
            </div>
            {/* Informações de preço */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
              <h3 className="font-semibold text-amber-800 mb-1">
                💰 Valor: R$ 60,00
              </h3>
              <p className="text-sm text-amber-700">
                Todas as estampas e tamanhos
              </p>
            </div>
          </div>

          {/* Resumo do Pedido */}
          {(tamanhoSelecionado || estampaSelecionada) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                📋 Resumo do Pedido:
              </h3>
              <div className="space-y-1 text-sm text-blue-700">
                {tamanhoSelecionado && (
                  <p>
                    <strong>Tamanho:</strong>{" "}
                    {
                      tamanhos.find(
                        (t) => t.id === parseInt(tamanhoSelecionado)
                      )?.nome
                    }
                  </p>
                )}
                {estampaSelecionada && (
                  <p>
                    <strong>Estampa:</strong>{" "}
                    {
                      estampas.find(
                        (e) => e.id === parseInt(estampaSelecionada)
                      )?.nome
                    }
                  </p>
                )}
                <p>
                  <strong>Valor Total:</strong> R$ 60,00
                </p>
              </div>
            </div>
          )}

          {/* Botão de Envio */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full max-w-md bg-[#ef8e2e] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#d77a26] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Processando..." : "Finalizar Pedido"}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de Imagem Ampliada */}
      {imagemModalAberto && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 bg-black/90">
          <div className="relative max-w-7xl max-h-[95vh] w-full z-10">
            {/* Botão de Fechar */}
            <button
              type="button"
              onClick={fecharModalImagem}
              className="absolute top-4 right-4 w-12 h-12 bg-white/90 hover:bg-white text-black rounded-full flex items-center justify-center transition-colors z-20 shadow-lg"
              aria-label="Fechar modal"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Fechar</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Imagem */}
            <div className="bg-white rounded-lg overflow-hidden z-10 shadow-2xl">
              <div className="relative w-full max-h-[85vh] min-h-[500px]">
                <Image
                  src={imagemModalSrc}
                  alt={imagemModalAlt}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {imagemModalAlt}
                </h3>
                <p className="text-sm text-gray-600">
                  {estampas.find((e) => e.nome === imagemModalAlt)?.descricao}
                </p>
              </div>
            </div>
          </div>

          {/* Overlay clicável para fechar */}
          <button
            type="button"
            className="absolute inset-0 z-0 bg-transparent border-none cursor-pointer"
            onClick={fecharModalImagem}
            onKeyDown={(e) => {
              if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
                fecharModalImagem();
              }
            }}
            aria-label="Fechar modal clicando fora da imagem"
          />
        </div>
      )}
    </div>
  );
}
