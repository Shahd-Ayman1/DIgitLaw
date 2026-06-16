from __future__ import annotations

from langgraph.graph import END, StateGraph

from app.graphs.legal_assistant.nodes_domain import detect_domain_node
from app.graphs.legal_assistant.nodes_generation import generate_answer_node
from app.graphs.legal_assistant.nodes_retrieval import retrieve_node
from app.graphs.legal_assistant.nodes_verification import verify_node
from app.graphs.legal_assistant.state import LegalAssistantState


def build_legal_assistant_graph():
    graph = StateGraph(LegalAssistantState)

    graph.add_node("detect_domain", detect_domain_node)
    graph.add_node("retrieve", retrieve_node)
    graph.add_node("generate_answer", generate_answer_node)
    graph.add_node("verify", verify_node)

    graph.set_entry_point("detect_domain")
    graph.add_edge("detect_domain", "retrieve")
    graph.add_edge("retrieve", "generate_answer")
    graph.add_edge("generate_answer", "verify")
    graph.add_edge("verify", END)

    return graph.compile()


# Singleton compiled graph
legal_assistant_graph = build_legal_assistant_graph()
